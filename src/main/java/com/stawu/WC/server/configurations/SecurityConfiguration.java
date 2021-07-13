package com.stawu.WC.server.configurations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private DataSource m_dataSource;

    @Autowired
    public void authConfiguration(AuthenticationManagerBuilder authManagerBuilder, DataSource dataSource) throws Exception {
        authManagerBuilder.jdbcAuthentication()
                .dataSource(dataSource)
                .withDefaultSchema();
    }

    @Bean
    public JdbcUserDetailsManager userDetailsManager() {
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager();
        manager.setDataSource(m_dataSource);
        manager.setUsersByUsernameQuery(
                "select username,password,enabled from users where username=?");
        manager.setAuthoritiesByUsernameQuery(
                "select username, authority from authorities where username=?");
        manager.setRolePrefix("ROLE_");
        return manager;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/api/register").permitAll()
                .antMatchers("/api/**").authenticated()
                .and().formLogin().permitAll()
                .and().logout().permitAll()
                .and().logout().logoutSuccessUrl("/")
                .and().csrf().disable();

        //Linijka zeby dzialala h2-console
        http.headers().frameOptions().disable();
    }
}
