import type { Metadata } from "next";
import SpringLesson, { CodeBlock, ConceptCheck, Practice } from "../SpringLesson";

export const metadata: Metadata = {
  title: "02 — First Spring Boot Application | Spring Boot Series",
  description:
    "Build a minimal non-web Spring Boot 4 application and understand starters, @SpringBootApplication and the component scan boundary.",
};

export default function FirstApplicationPage() {
  return (
    <SpringLesson
      number="02"
      title={<>Build the smallest useful <em>Spring Boot application.</em></>}
      summary="This module creates a real Boot project without a web server. Keeping the first application non-web makes it easier to see what the framework starts and what it does not."
      outcomes={[
        "distinguish the Maven parent from a starter dependency",
        "explain the three responsibilities grouped by @SpringBootApplication",
        "predict the default component scan boundary",
        "explain why spring-boot-starter does not start an embedded web server",
      ]}
      previous={{ href: "/spring-boot/01-why-spring/", label: "Why Spring exists" }}
      next={{ href: "/spring-boot/03-beans-and-injection/", label: "Beans and injection" }}
    >
      <section>
        <p className="section-index">Project shape</p>
        <h2>Three files are enough for the first run.</h2>
        <CodeBlock label="Directory layout">{`orders/
├── pom.xml
└── src/main/
    ├── java/com/example/orders/
    │   └── OrdersApplication.java
    └── resources/
        └── application.properties`}</CodeBlock>
        <p>
          The application class sits in the root package{" "}
          <code>com.example.orders</code>. Later components should live in that package
          or one of its subpackages so the default scan can find them.
        </p>
        <p>
          Maven&apos;s standard layout separates Java source from runtime resources.
          Package names belong to Java; folders mirror those packages. Properties are
          resources placed on the classpath, so they live below{" "}
          <code>src/main/resources</code> rather than inside a Java package.
        </p>
        <div className="spring-example-grid">
          <div>
            <h3>Java source</h3>
            <p>
              Compiled into bytecode. Classes, interfaces, records and annotations live
              below <code>src/main/java</code>.
            </p>
          </div>
          <div>
            <h3>Resources</h3>
            <p>
              Copied into the application classpath. Configuration, templates and static
              files can live below <code>src/main/resources</code>.
            </p>
          </div>
        </div>
      </section>

      <section>
        <p className="section-index">Maven responsibilities</p>
        <h2>The parent supplies build defaults; the starter supplies libraries.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>spring-boot-starter-parent</h3>
            <p>
              A Maven parent that provides compatible dependency versions, plugin
              management and sensible compiler/resource defaults. It is not a jar added
              to the running application.
            </p>
          </div>
          <div>
            <h3>spring-boot-starter</h3>
            <p>
              A dependency bundle for core Boot support, auto-configuration and logging.
              It does not include the servlet stack required for an HTTP server.
            </p>
          </div>
          <div>
            <h3>spring-boot-maven-plugin</h3>
            <p>
              Builds an executable Boot jar and provides Maven goals such as{" "}
              <code>spring-boot:run</code>.
            </p>
          </div>
        </div>
        <p>
          These three entries solve different build problems. The parent controls Maven
          defaults, the starter contributes dependencies to the application classpath,
          and the plugin changes how the application is run and packaged. Removing one
          does not mean the other two take over its job.
        </p>
        <CodeBlock label="Why dependency management matters">{`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <!-- No version here -->
</dependency>`}</CodeBlock>
        <p>
          The starter version is omitted because the Boot parent manages a tested set of
          versions. If every Spring library were versioned independently, Maven could
          resolve a combination that compiles poorly or fails at runtime.
        </p>
        <ConceptCheck question="Does a starter contain all of Spring Boot's implementation code?">
          <p>
            No. A starter is mainly a convenient dependency descriptor. It brings the
            relevant libraries into the dependency graph. The implementation still lives
            in normal jars such as Spring Framework and Spring Boot auto-configuration.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">The application annotation</p>
        <h2>@SpringBootApplication combines three roles.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>@Configuration</h3>
            <p>The class may contribute bean definitions and application configuration.</p>
          </div>
          <div>
            <h3>@EnableAutoConfiguration</h3>
            <p>
              Boot evaluates available classes, existing beans and configuration to
              decide which infrastructure it can provide.
            </p>
          </div>
          <div>
            <h3>@ComponentScan</h3>
            <p>
              Spring searches the application class package and its subpackages for
              component classes.
            </p>
          </div>
        </div>
        <p>
          Conceptually, the composed annotation gives the application class the same
          three roles as the explicit form below:
        </p>
        <CodeBlock label="Conceptual expanded form">{`@Configuration
@EnableAutoConfiguration
@ComponentScan
public class OrdersApplication {
    // ...
}`}</CodeBlock>
        <p>
          Use <code>@SpringBootApplication</code> for the normal entry point. The expanded
          form is useful for understanding, not a recommendation to replace the composed
          annotation in every project.
        </p>
        <CodeBlock label="Application entry point">{`package com.example.orders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrdersApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrdersApplication.class, args);
    }
}`}</CodeBlock>
        <p>
          <code>SpringApplication.run(...)</code> creates and refreshes an{" "}
          <code>ApplicationContext</code>. The method returns the context, but normal
          business code receives beans through injection instead of retrieving them
          manually.
        </p>
      </section>

      <section>
        <p className="section-index">Startup, step by step</p>
        <h2>SpringApplication.run builds and refreshes the container.</h2>
        <ol className="spring-flow-list">
          <li>
            <span>01</span>
            <div>
              <h3>Inspect the classpath</h3>
              <p>
                Boot determines whether this looks like a servlet web application,
                reactive web application or non-web application.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Prepare the environment</h3>
              <p>
                Command-line arguments, system values and application properties become
                available as configuration.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Create the appropriate ApplicationContext</h3>
              <p>
                This project gets a non-web context because no servlet or reactive web
                application stack is present.
              </p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <h3>Load bean definitions</h3>
              <p>
                The application configuration, component scan results and matching
                auto-configurations contribute recipes for objects.
              </p>
            </div>
          </li>
          <li>
            <span>05</span>
            <div>
              <h3>Refresh the context</h3>
              <p>
                Spring creates non-lazy singleton beans, resolves constructor
                dependencies and runs lifecycle callbacks.
              </p>
            </div>
          </li>
          <li>
            <span>06</span>
            <div>
              <h3>Run startup callbacks</h3>
              <p>
                Boot invokes <code>CommandLineRunner</code> and{" "}
                <code>ApplicationRunner</code> beans after successful startup.
              </p>
            </div>
          </li>
        </ol>
        <p>
          This is why a missing dependency usually prevents startup: the context must
          build a complete valid graph before the application begins normal work.
        </p>
      </section>

      <section>
        <p className="section-index">The scan boundary</p>
        <h2>The application class location is an architectural decision.</h2>
        <CodeBlock label="What the default scan includes">{`com.example.orders
├── OrdersApplication              // scan starts here
├── notification
│   └── EmailNotificationSender    // included
├── service
│   └── OrderService               // included
└── runner
    └── DemoRunner                 // included

com.example.payments
└── PaymentService                 // not included`}</CodeBlock>
        <p>
          <code>@ComponentScan</code> begins with the package containing{" "}
          <code>OrdersApplication</code>. It walks downward through subpackages; it does
          not walk upward to <code>com.example</code> and then down into sibling packages.
        </p>
        <div className="spring-example-grid">
          <div>
            <h3>Good default</h3>
            <p>
              Put the application class at the root of one application&apos;s packages,
              then group features below it.
            </p>
          </div>
          <div>
            <h3>Common surprise</h3>
            <p>
              A correctly annotated service outside the root is still invisible to the
              default scan.
            </p>
          </div>
        </div>
        <ConceptCheck question="Would moving OrdersApplication to com.example include payments?">
          <p>
            Yes, because both <code>com.example.orders</code> and{" "}
            <code>com.example.payments</code> would become subpackages. That may be
            intentional for one application, but a broad root can also discover unrelated
            configuration. Choose the root based on application ownership, not merely to
            silence a missing-bean error.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Predict startup behaviour</p>
        <h2>No servlet classes means no embedded web server.</h2>
        <p>
          Auto-configuration reacts to what is available. With only{" "}
          <code>spring-boot-starter</code>, Boot creates a non-web application context,
          logs that the application started and then exits when no non-daemon work
          remains. Adding web libraries later changes the conditions that match.
        </p>
        <div className="spring-comparison-table-wrap">
          <table className="spring-comparison-table">
            <thead>
              <tr>
                <th>Dependencies</th>
                <th>Application type</th>
                <th>Typical result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>spring-boot-starter</code></td>
                <td>Non-web</td>
                <td>Creates the context; no HTTP port is opened.</td>
              </tr>
              <tr>
                <td><code>spring-boot-starter-webmvc</code></td>
                <td>Servlet web</td>
                <td>Configures Spring MVC and normally starts an embedded servlet server.</td>
              </tr>
              <tr>
                <td>Reactive web starter</td>
                <td>Reactive web</td>
                <td>Creates reactive web infrastructure when its conditions match.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <code>@SpringBootApplication</code> is present in all three cases. The
          annotation does not mean “start Tomcat.” It enables conditional configuration;
          the classpath supplies evidence about which kind of application is being built.
        </p>
        <ConceptCheck question="Will adding an @RestController start a server by itself?">
          <p>
            No. The annotation can make the class a component, but it does not add servlet
            APIs, Spring MVC or an embedded server to the classpath. Dependencies provide
            the tooling; annotations let Spring classify and configure your classes.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">The first property</p>
        <h2>application.properties changes configuration, not Java structure.</h2>
        <CodeBlock label="application.properties">{`spring.application.name=orders`}</CodeBlock>
        <p>
          The application name can appear in logging, metrics and other infrastructure.
          It does not rename the Java class, Maven artifact or package. Those are separate
          identities that happen to use a consistent name in this example.
        </p>
        <CodeBlock label="Four different names with different owners">{`Maven artifact:     orders
Java class:        OrdersApplication
Java package:      com.example.orders
Spring property:   spring.application.name=orders`}</CodeBlock>
      </section>

      <Practice
        time="Suggested time: 10 minutes"
        hints={
          <ol>
            <li>Use Java 17 and Spring Boot 4.1.1 as this series&apos; fixed baseline.</li>
            <li>The only runtime starter needed is <code>spring-boot-starter</code>.</li>
            <li>Keep the application class in <code>com.example.orders</code> and give its file the exact public class name.</li>
          </ol>
        }
        solution={
          <>
            <CodeBlock label="pom.xml">{`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.1.1</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>orders</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`}</CodeBlock>
            <CodeBlock label="OrdersApplication.java">{`package com.example.orders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrdersApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrdersApplication.class, args);
    }
}`}</CodeBlock>
            <CodeBlock label="application.properties">{`spring.application.name=orders`}</CodeBlock>
            <p>
              Run with <code>mvn spring-boot:run</code>. A successful startup does not
              include Tomcat, Jetty or Netty because no web stack is present.
            </p>
          </>
        }
      >
        <p>
          From an empty directory, create a minimal Maven Spring Boot application named{" "}
          <code>orders</code>.
        </p>
        <ul>
          <li>Use Spring Boot 4.1.1 and Java 17.</li>
          <li>Do not add a web dependency.</li>
          <li>Use the package <code>com.example.orders</code>.</li>
          <li>Set the application name in properties.</li>
        </ul>
      </Practice>

      <section className="spring-recap">
        <p className="section-index">Foundation check</p>
        <h2>Where will Spring scan?</h2>
        <p>
          With the application class in <code>com.example.orders</code>, the default
          scan covers that package and its subpackages. A component in{" "}
          <code>com.example.payments</code> is outside that boundary.
        </p>
      </section>
    </SpringLesson>
  );
}
