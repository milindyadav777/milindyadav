import type { Metadata } from "next";
import SpringLesson, { CodeBlock, Practice } from "../SpringLesson";

export const metadata: Metadata = {
  title: "05 — Spring Boot Auto-configuration | Spring Boot Series",
  description:
    "Learn starters, auto-configuration candidates, conditional beans, property matching and Spring Boot's back-off model.",
};

export default function AutoConfigurationPage() {
  return (
    <SpringLesson
      number="05"
      title={<>Let Boot contribute defaults that <em>back off cleanly.</em></>}
      summary="Auto-configuration is conditional configuration supplied by libraries. It observes the classpath, existing beans and properties, then contributes only the definitions whose conditions match."
      outcomes={[
        "distinguish a library, a starter and an auto-configuration",
        "explain how auto-configuration candidates are discovered",
        "evaluate class, bean and property conditions independently",
        "predict when a user-defined bean makes Boot back off",
      ]}
      previous={{ href: "/spring-boot/04-component-scanning-and-bean-creation/", label: "Bean creation" }}
    >
      <section>
        <p className="section-index">Three different pieces</p>
        <h2>A starter brings dependencies; auto-configuration creates conditional beans.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>Library</h3>
            <p>
              Provides classes and behaviour, such as a database driver or email client.
              Adding a library does not necessarily create any Spring beans.
            </p>
          </div>
          <div>
            <h3>Starter</h3>
            <p>
              A dependency descriptor that brings together a compatible set of libraries
              for one capability.
            </p>
          </div>
          <div>
            <h3>Auto-configuration</h3>
            <p>
              Configuration classes that create useful default beans when their
              conditions match.
            </p>
          </div>
        </div>
        <p>
          This is why adding one dependency can change startup behaviour: a class that
          was absent is now present, so a classpath condition may begin to match.
        </p>
      </section>

      <section>
        <p className="section-index">Candidate discovery</p>
        <h2>Auto-configuration is imported, not found by your component scan.</h2>
        <p>
          <code>@EnableAutoConfiguration</code>, included by{" "}
          <code>@SpringBootApplication</code>, asks Boot to load candidate configuration
          classes. A reusable library lists those candidates in:
        </p>
        <CodeBlock label="AutoConfiguration.imports">{`META-INF/spring/
└── org.springframework.boot.autoconfigure.AutoConfiguration.imports`}</CodeBlock>
        <CodeBlock label="File contents">{`com.example.notification.NotificationAutoConfiguration`}</CodeBlock>
        <p>
          The configuration class is marked <code>@AutoConfiguration</code>. Merely
          placing it under <code>com.example.orders</code> is not the registration
          mechanism for a reusable auto-configuration.
        </p>
      </section>

      <section>
        <p className="section-index">Conditions</p>
        <h2>Every declared condition must match.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>@ConditionalOnClass</h3>
            <p>Create the configuration only when a required library class is available.</p>
          </div>
          <div>
            <h3>@ConditionalOnMissingBean</h3>
            <p>Provide a default only when the application has not already supplied that bean type.</p>
          </div>
          <div>
            <h3>@ConditionalOnProperty</h3>
            <p>Enable or disable configuration from an external property and its missing-value rule.</p>
          </div>
        </div>
        <CodeBlock label="A conditional default">{`@Bean
@ConditionalOnMissingBean(NotificationSender.class)
@ConditionalOnProperty(
        prefix = "orders.notification",
        name = "enabled",
        havingValue = "true",
        matchIfMissing = true
)
public NotificationSender notificationSender() {
    return new EmailNotificationSender();
}`}</CodeBlock>
        <p>
          Here, <code>true</code> matches, <code>false</code> does not, and a missing
          property also matches because <code>matchIfMissing</code> is{" "}
          <code>true</code>.
        </p>
      </section>

      <section>
        <p className="section-index">Back-off</p>
        <h2>User configuration has the final say.</h2>
        <p>
          <code>@ConditionalOnMissingBean</code> is the central back-off mechanism. The
          auto-configuration offers a useful default, while an application can replace
          that default simply by defining its own bean. No framework source code needs to
          be edited.
        </p>
        <p>
          When startup behaviour is surprising, run with <code>--debug</code> or set{" "}
          <code>debug=true</code>. The condition evaluation report shows positive and
          negative matches and the reason for each decision.
        </p>
      </section>

      <Practice
        time="Suggested time: 12 minutes"
        hints={
          <ol>
            <li>Put the classpath condition on the auto-configuration class.</li>
            <li>Put the missing-bean and property conditions on the bean method.</li>
            <li>All conditions are combined with logical AND.</li>
            <li>A user-defined <code>SmsNotificationSender</code> still counts as a <code>NotificationSender</code> bean.</li>
          </ol>
        }
        solution={
          <>
            <CodeBlock label="NotificationAutoConfiguration.java">{`package com.example.notification;

import com.example.email.EmailClient;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@ConditionalOnClass(EmailClient.class)
public class NotificationAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(NotificationSender.class)
    @ConditionalOnProperty(
            prefix = "orders.notification",
            name = "enabled",
            havingValue = "true",
            matchIfMissing = true
    )
    public NotificationSender notificationSender() {
        return new EmailNotificationSender();
    }
}`}</CodeBlock>
            <CodeBlock label="AutoConfiguration.imports">{`com.example.notification.NotificationAutoConfiguration`}</CodeBlock>
            <div className="spring-condition-result">
              <h3>Scenario result</h3>
              <ol>
                <li><strong>OnClass:</strong> matches because <code>EmailClient</code> is present.</li>
                <li><strong>OnProperty:</strong> matches because the property is missing and <code>matchIfMissing = true</code>.</li>
                <li><strong>OnMissingBean:</strong> does not match because the user&apos;s SMS bean implements <code>NotificationSender</code>.</li>
              </ol>
              <p>
                The conditions are ANDed, so the email bean is not created. The final
                context contains the user-defined SMS <code>NotificationSender</code>,
                not both implementations.
              </p>
            </div>
          </>
        }
      >
        <p>
          Write an auto-configuration that creates an email{" "}
          <code>NotificationSender</code> only when:
        </p>
        <ol>
          <li><code>EmailClient</code> is on the classpath.</li>
          <li>No <code>NotificationSender</code> bean already exists.</li>
          <li><code>orders.notification.enabled</code> is true or missing.</li>
        </ol>
        <p>
          Then evaluate this scenario: <code>EmailClient</code> is present, the property
          is missing, and the application defines an SMS bean that implements{" "}
          <code>NotificationSender</code>. State each condition result and the final
          beans in the context.
        </p>
      </Practice>

      <section className="spring-recap">
        <p className="section-index">Foundation check</p>
        <h2>Component scanning and auto-configuration solve different discovery problems.</h2>
        <p>
          Component scanning finds your annotated application classes below a package
          root. Auto-configuration imports library-provided candidates and then filters
          them with conditions. Both can contribute beans to the same context.
        </p>
      </section>
    </SpringLesson>
  );
}
