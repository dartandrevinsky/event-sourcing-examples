package net.chrisrichardson.eventstore.javaexamples.banking.web;

import net.chrisrichardson.eventstore.javaexamples.banking.common.customers.*;
import net.chrisrichardson.eventstore.javaexamples.banking.web.commandside.transactions.CreateMoneyTransferRequest;
import net.chrisrichardson.eventstore.javaexamples.banking.web.commandside.transactions.CreateMoneyTransferResponse;
import net.chrisrichardson.eventstore.javaexamples.banking.web.queryside.accounts.GetAccountResponse;
import net.chrisrichardson.eventstore.javaexamples.banking.web.commandside.accounts.CreateAccountRequest;
import net.chrisrichardson.eventstore.javaexamples.banking.web.commandside.accounts.CreateAccountResponse;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

import net.chrisrichardson.eventstorestore.javaexamples.testutil.Producer;
import net.chrisrichardson.eventstorestore.javaexamples.testutil.Verifier;
import rx.Observable;

import static net.chrisrichardson.eventstorestore.javaexamples.testutil.TestUtil.eventually;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = BankingWebTestConfiguration.class)
@WebAppConfiguration
@IntegrationTest({"server.port=0", "management.port=0"})
public class BankingWebIntegrationTest {

  @Value("${local.server.port}")
  private int port;

  private String baseUrl(String path) {
    return "http://localhost:" + port + "/" + path;
  }

  @Autowired
  RestTemplate restTemplate;


  @Test
  public void shouldCreateAccountsAndTransferMoney() {
    BigDecimal initialFromAccountBalance = new BigDecimal(500);
    BigDecimal initialToAccountBalance = new BigDecimal(100);
    BigDecimal amountToTransfer = new BigDecimal(150);

    BigDecimal finalFromAccountBalance = initialFromAccountBalance.subtract(amountToTransfer);
    BigDecimal finalToAccountBalance = initialToAccountBalance.add(amountToTransfer);

    final CreateAccountResponse fromAccount = restTemplate.postForEntity(baseUrl("/accounts"), new CreateAccountRequest("00000000-00000000", "My Account", initialFromAccountBalance), CreateAccountResponse.class).getBody();
    final String fromAccountId = fromAccount.getAccountId();

    CreateAccountResponse toAccount = restTemplate.postForEntity(baseUrl("/accounts"), new CreateAccountRequest("00000000-00000000", "My Account", initialToAccountBalance), CreateAccountResponse.class).getBody();
    String toAccountId = toAccount.getAccountId();

    Assert.assertNotNull(fromAccountId);
    Assert.assertNotNull(toAccountId);

    assertAccountBalance(fromAccountId, initialFromAccountBalance);
    assertAccountBalance(toAccountId, initialToAccountBalance);


    final CreateMoneyTransferResponse moneyTransfer = restTemplate.postForEntity(baseUrl("/transfers"),
            new CreateMoneyTransferRequest(fromAccountId, toAccountId, amountToTransfer), CreateMoneyTransferResponse.class).getBody();

    assertAccountBalance(fromAccountId, finalFromAccountBalance);
    assertAccountBalance(toAccountId, finalToAccountBalance);

  }

  @Test
  public void shouldCreateCustomers() {
    CustomerInfo customerInfo = generateCustomerInfo();

    final CustomerResponse customerResponse = restTemplate.postForEntity(baseUrl("/customers"), customerInfo, CustomerResponse.class).getBody();
    final String customerId = customerResponse.getId();

    Assert.assertNotNull(customerId);
    Assert.assertEquals(customerInfo, customerResponse.getCustomerInfo());

    assertCustomerResponse(customerId, customerInfo);
  }

  private BigDecimal toCents(BigDecimal dollarAmount) {
    return dollarAmount.multiply(new BigDecimal(100));
  }

  private void assertAccountBalance(final String fromAccountId, final BigDecimal expectedBalanceInDollars) {
    final BigDecimal inCents = toCents(expectedBalanceInDollars);
    eventually(
            new Producer<GetAccountResponse>() {
              @Override
              public Observable<GetAccountResponse> produce() {
                return Observable.just(restTemplate.getForEntity(baseUrl("/accounts/" + fromAccountId), GetAccountResponse.class).getBody());
              }
            },
            new Verifier<GetAccountResponse>() {
              @Override
              public void verify(GetAccountResponse accountInfo) {
                Assert.assertEquals(fromAccountId, accountInfo.getAccountId());
                Assert.assertEquals(inCents, accountInfo.getBalance());
              }
            });
  }

  private void assertCustomerResponse(final String customerId, final CustomerInfo customerInfo) {
    eventually(
            new Producer<CustomerResponse>() {
              @Override
              public Observable<CustomerResponse> produce() {
                return Observable.just(restTemplate.getForEntity(baseUrl("/customers/" + customerId), CustomerResponse.class).getBody());
              }
            },
            new Verifier<CustomerResponse>() {
              @Override
              public void verify(CustomerResponse customerResponse) {
                Assert.assertEquals(customerId, customerResponse.getId());
                Assert.assertEquals(customerInfo, customerResponse.getCustomerInfo());
              }
            });
  }

  private CustomerInfo generateCustomerInfo() {
    return new CustomerInfo(
            new Name("John", "Doe"),
            "current@email.com",
            "000-00-0000",
            "1-111-111-1111",
            new Address("street 1",
                    "street 2",
                    "City",
                    "State",
                    "1111111")
    );
  }

  private ToAccountInfo generateToAccountInfo() {
    return new ToAccountInfo("11111111-11111111", "New Account", "John Doe");
  }
}
