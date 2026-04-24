package com.ticketnow.backend;

import org.h2.server.web.JakartaWebServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Explicitly register the H2 console servlet (Spring Boot 4 / Jakarta Servlet 6)
    @Bean
    public ServletRegistrationBean<JakartaWebServlet> h2ConsoleServlet() {
        ServletRegistrationBean<JakartaWebServlet> bean =
                new ServletRegistrationBean<>(new JakartaWebServlet(), "/h2-console/*");
        bean.addInitParameter("webAllowOthers", "true");
        return bean;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — needed for H2 console POST requests and REST API
            .csrf(csrf -> csrf.disable())

            // Allow same-origin iframes — H2 console is an iframe-based UI
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            )

            // Permit all requests — our auth is handled manually in AuthController
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            // No login page, no HTTP Basic pop-up
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
