import type { Metadata } from "next";
import SpringLesson, { CodeBlock, Practice } from "../SpringLesson";

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
        <CodeBlock label="Directory layout">{`mckesson-orders/
├── pom.xml
└── src/main/
    ├── java/com/mckesson/orders/
    │   └── MckessonOrdersApplication.java
    └── resources/
        └── application.properties`}</CodeBlock>
        <p>
          The application class sits in the root package{" "}
          <code>com.mckesson.orders</code>. Later components should live in that package
          or one of its subpackages so the default scan can find them.
        </p>
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
        <CodeBlock label="Application entry point">{`package com.mckesson.orders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MckessonOrdersApplication {

    public static void main(String[] args) {
        SpringApplication.run(MckessonOrdersApplication.class, args);
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
        <p className="section-index">Predict startup behaviour</p>
        <h2>No servlet classes means no embedded web server.</h2>
        <p>
          Auto-configuration reacts to what is available. With only{" "}
          <code>spring-boot-starter</code>, Boot creates a non-web application context,
          logs that the application started and then exits when no non-daemon work
          remains. Adding web libraries later changes the conditions that match.
        </p>
      </section>

      <Practice
        time="Suggested time: 10 minutes"
        hints={
          <ol>
            <li>Use Java 17 and Spring Boot 4.1.1 as this series&apos; fixed baseline.</li>
            <li>The only runtime starter needed is <code>spring-boot-starter</code>.</li>
            <li>Keep the application class in <code>com.mckesson.orders</code> and give its file the exact public class name.</li>
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

    <groupId>com.mckesson</groupId>
    <artifactId>mckesson-orders</artifactId>
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
            <CodeBlock label="MckessonOrdersApplication.java">{`package com.mckesson.orders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MckessonOrdersApplication {

    public static void main(String[] args) {
        SpringApplication.run(MckessonOrdersApplication.class, args);
    }
}`}</CodeBlock>
            <CodeBlock label="application.properties">{`spring.application.name=mckesson-orders`}</CodeBlock>
            <p>
              Run with <code>mvn spring-boot:run</code>. A successful startup does not
              include Tomcat, Jetty or Netty because no web stack is present.
            </p>
          </>
        }
      >
        <p>
          From an empty directory, create a minimal Maven Spring Boot application named{" "}
          <code>mckesson-orders</code>.
        </p>
        <ul>
          <li>Use Spring Boot 4.1.1 and Java 17.</li>
          <li>Do not add a web dependency.</li>
          <li>Use the package <code>com.mckesson.orders</code>.</li>
          <li>Set the application name in properties.</li>
        </ul>
      </Practice>

      <section className="spring-recap">
        <p className="section-index">Foundation check</p>
        <h2>Where will Spring scan?</h2>
        <p>
          With the application class in <code>com.mckesson.orders</code>, the default
          scan covers that package and its subpackages. A component in{" "}
          <code>com.mckesson.payments</code> is outside that boundary.
        </p>
      </section>
    </SpringLesson>
  );
}
