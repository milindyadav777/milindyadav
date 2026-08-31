import type { Metadata } from "next";
import SpringLesson, { CodeBlock, Practice } from "../SpringLesson";

export const metadata: Metadata = {
  title: "04 — Component Scanning and Bean Creation | Spring Boot Series",
  description:
    "Learn component scan boundaries, explicit @Bean methods, @Configuration proxy behaviour and injectable java.time.Clock design.",
};

export default function BeanCreationPage() {
  return (
    <SpringLesson
      number="04"
      title={<>Understand how Spring <em>finds and creates beans.</em></>}
      summary="Stereotypes are convenient for application classes, but not every dependency can or should be annotated. Explicit configuration gives the application a clear place to construct third-party and policy-driven objects."
      outcomes={[
        "state exactly which packages the default component scan searches",
        "choose between a component stereotype and an explicit @Bean method",
        "use method-parameter injection safely with proxyBeanMethods=false",
        "inject Clock so time-dependent code is deterministic and testable",
      ]}
      previous={{ href: "/spring-boot/03-beans-and-injection/", label: "Beans and injection" }}
      next={{ href: "/spring-boot/05-auto-configuration/", label: "Auto-configuration" }}
    >
      <section>
        <p className="section-index">Discovery boundary</p>
        <h2>Component scanning starts at the application package.</h2>
        <p>
          With <code>OrdersApplication</code> in{" "}
          <code>com.example.orders</code>, the default scan searches that package and
          every subpackage. It finds classes such as:
        </p>
        <CodeBlock label="Inside the default scan">{`com.example.orders.notification.EmailNotificationSender
com.example.orders.service.OrderService
com.example.orders.configuration.TimeConfiguration
com.example.orders.runner.DemoRunner`}</CodeBlock>
        <p>
          It does not automatically scan a sibling such as{" "}
          <code>com.example.payments</code>. Put the application class at a sensible
          package root instead of widening the scan without a reason.
        </p>
      </section>

      <section>
        <p className="section-index">Two creation paths</p>
        <h2>Use scanning for your components and @Bean for explicit construction.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>Stereotype annotation</h3>
            <p>
              Use <code>@Component</code>, <code>@Service</code> or{" "}
              <code>@Repository</code> when you own the class and its role belongs in
              the application.
            </p>
          </div>
          <div>
            <h3>@Bean factory method</h3>
            <p>
              Use a method in <code>@Configuration</code> when the class comes from a
              library, construction needs explicit values, or the application should own
              the creation policy.
            </p>
          </div>
        </div>
        <CodeBlock label="Explicit bean definitions">{`@Configuration(proxyBeanMethods = false)
public class TimeConfiguration {

    @Bean
    public Clock applicationClock() {
        return Clock.systemUTC();
    }

    @Bean
    public OrderTimestampService orderTimestampService(
            Clock applicationClock
    ) {
        return new OrderTimestampService(applicationClock);
    }
}`}</CodeBlock>
        <p>
          The default bean names here are <code>applicationClock</code> and{" "}
          <code>orderTimestampService</code>, taken from the method names. Spring resolves
          the <code>Clock</code> parameter before invoking the second method.
        </p>
      </section>

      <section>
        <p className="section-index">proxyBeanMethods</p>
        <h2>With proxies disabled, direct method calls are ordinary Java calls.</h2>
        <p>
          <code>@Configuration(proxyBeanMethods = false)</code> avoids method
          interception. It is efficient and clear when bean methods are independent or
          receive other beans as parameters.
        </p>
        <CodeBlock label="Prefer parameter injection">{`// Correct: Spring supplies its managed TokenGenerator bean.
@Bean
public OtpService otpService(TokenGenerator tokenGenerator) {
    return new OtpService(tokenGenerator);
}

// Risky with proxyBeanMethods = false:
@Bean
public OtpService anotherOtpService() {
    return new OtpService(tokenGenerator());
    // tokenGenerator() is a normal Java call and creates another instance.
}`}</CodeBlock>
        <p>
          The default <code>@Configuration</code> mode uses a proxy that can intercept
          calls between <code>@Bean</code> methods and return the managed bean. Parameter
          injection works in either mode and states the dependency more directly.
        </p>
      </section>

      <section>
        <p className="section-index">Managed and ordinary objects</p>
        <h2>Spring should manage services and infrastructure, not every object.</h2>
        <p>
          Spring-managed objects participate in injection, scopes and lifecycle
          callbacks. Short-lived domain values—request DTOs, entities, value objects and
          exceptions—are normally created by application or persistence code. They do
          not need to be fetched from the <code>ApplicationContext</code>.
        </p>
        <p>
          When a managed service needs another managed object, constructor injection is
          the normal path. Direct context access remains an integration escape hatch, not
          the default application design.
        </p>
      </section>

      <section>
        <p className="section-index">Inject time</p>
        <h2>Clock turns the current time into a replaceable dependency.</h2>
        <CodeBlock label="A deterministic Clock">{`Clock fixedClock = Clock.fixed(
        Instant.parse("2026-08-31T00:00:00Z"),
        ZoneOffset.UTC
);`}</CodeBlock>
        <p>
          <code>Clock.fixed(...)</code> always returns the same instant. That is useful in
          this learning checkpoint and in tests. A production bean usually returns{" "}
          <code>Clock.systemUTC()</code>, while a test configuration supplies a fixed
          clock.
        </p>
      </section>

      <Practice
        time="Suggested time: 15 minutes"
        hints={
          <ol>
            <li><code>OrderTimestampService</code> needs imports for both <code>Clock</code> and <code>Instant</code>.</li>
            <li>Create the clock and service through two <code>@Bean</code> methods.</li>
            <li>Inject <code>Clock</code> as a parameter to the service bean method; do not call <code>applicationClock()</code>.</li>
            <li>Add <code>OrderTimestampService</code> to all three places in the runner constructor: parameter, assignment and field.</li>
          </ol>
        }
        solution={
          <>
            <CodeBlock label="OrderTimestampService.java">{`package com.example.orders.time;

import java.time.Clock;
import java.time.Instant;

public class OrderTimestampService {
    private final Clock applicationClock;

    public OrderTimestampService(Clock applicationClock) {
        this.applicationClock = applicationClock;
    }

    public Instant currentTimestamp() {
        return applicationClock.instant();
    }
}`}</CodeBlock>
            <CodeBlock label="TimeConfiguration.java">{`package com.example.orders.configuration;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.orders.time.OrderTimestampService;

@Configuration(proxyBeanMethods = false)
public class TimeConfiguration {

    @Bean
    public Clock applicationClock() {
        return Clock.fixed(
                Instant.parse("2026-08-31T00:00:00Z"),
                ZoneOffset.UTC
        );
    }

    @Bean
    public OrderTimestampService orderTimestampService(
            Clock applicationClock
    ) {
        return new OrderTimestampService(applicationClock);
    }
}`}</CodeBlock>
            <CodeBlock label="DemoRunner.java">{`package com.example.orders.runner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.orders.service.OrderService;
import com.example.orders.service.OtpService;
import com.example.orders.time.OrderTimestampService;

@Component
public class DemoRunner implements CommandLineRunner {
    private final OrderService orderService;
    private final OtpService otpService;
    private final OrderTimestampService orderTimestampService;

    public DemoRunner(
            OrderService orderService,
            OtpService otpService,
            OrderTimestampService orderTimestampService
    ) {
        this.orderService = orderService;
        this.otpService = otpService;
        this.orderTimestampService = orderTimestampService;
    }

    @Override
    public void run(String... args) {
        orderService.placeOrder("ORD-201", "customer@example.com");
        otpService.sendOtp("+919876543210", "482731");
        System.out.println(
                "TIMESTAMP: " + orderTimestampService.currentTimestamp()
        );
    }
}`}</CodeBlock>
            <CodeBlock label="Additional output">{`TIMESTAMP: 2026-08-31T00:00:00Z`}</CodeBlock>
          </>
        }
      >
        <p>Add deterministic timestamps to the existing non-web application.</p>
        <ul>
          <li>Create an <code>OrderTimestampService</code> that depends on <code>Clock</code>.</li>
          <li>Define a fixed UTC clock and the service in explicit configuration.</li>
          <li>Keep <code>proxyBeanMethods = false</code>.</li>
          <li>Print the timestamp from the existing runner.</li>
        </ul>
      </Practice>

      <section className="spring-recap">
        <p className="section-index">Foundation check</p>
        <h2>Who owns each object?</h2>
        <p>
          Spring owns the configured <code>Clock</code> and{" "}
          <code>OrderTimestampService</code> beans. The <code>Instant</code> returned by
          the service is an ordinary value object created by the clock; it is not a bean.
        </p>
      </section>
    </SpringLesson>
  );
}
