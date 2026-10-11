const post = {
  slug: 'sast-vs-dast-security-testing-tiers',
  title: 'SAST vs DAST: Three Tiers of Security Testing That Earn Their Place',
  date: '2026-10-10',
  tags: ['security', 'appsec', 'CI/CD'],
  excerpt:
    'A practical adoption framework for static and dynamic testing: start with useful signals, earn reliable coverage, and validate the risks scanners cannot understand alone.',
  body: (
    <>
      <p className="section-label">Application security / evidence over badges</p>
      <p>
        A scanner that finishes successfully has completed a job. It has not proved your application
        secure. The useful question is what it examined, what it missed, and whether its findings led
        to a verified fix. SAST and DAST answer different parts of that question.
      </p>
      <p>
        These three tiers are a practical, cumulative adoption framework—not a recognized security
        standard, a certification, or the verification levels in{' '}
        <a href="https://owasp.org/projects/asvs">OWASP ASVS</a>. Choose depth according to exposure,
        sensitive data, and business impact. A payment or multi-tenant authorization change may need
        Tier 3 attention immediately; it should not wait for an organization to “graduate.”
      </p>

      <h2>Two viewpoints, different blind spots</h2>
      <p>
        Static Application Security Testing examines source or compiled code without exercising the
        deployed application. It can identify risky patterns and trace modeled data flows near the
        developer’s work. Dynamic Application Security Testing interacts with a running application
        and evaluates observable behavior. Its reach depends on the routes, inputs, sessions, and
        states it actually visits. See OWASP’s{' '}
        <a href="https://community.owasp.org/Source_Code_Analysis_Tools">SAST overview</a> and{' '}
        <a href="https://devguide.owasp.org/en/06-verification/02-tools/01-dast/">DAST guidance</a>.
      </p>
      <div
        className="article-table-wrap"
        role="region"
        aria-label="Comparison of static and dynamic application security testing"
        tabIndex={0}
      >
        <table className="article-comparison">
          <caption>SAST and DAST are complementary, not interchangeable.</caption>
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">SAST</th>
              <th scope="col">DAST</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">What is inspected?</th>
              <td>Code, patterns, and modeled data flows</td>
              <td>Responses and behavior of a running target</td>
            </tr>
            <tr>
              <th scope="row">Where does it help?</th>
              <td>Early feedback with source locations</td>
              <td>Reachable runtime issues and deployment behavior</td>
            </tr>
            <tr>
              <th scope="row">What limits coverage?</th>
              <td>Language support, builds, rules, and framework models</td>
              <td>Discovery, authentication, roles, state, and scan policy</td>
            </tr>
            <tr>
              <th scope="row">What does a clean result mean?</th>
              <td>No finding under that analysis configuration</td>
              <td>No finding in the interactions performed</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        SAST offers early feedback but can generate false positives and require build maintenance.
        DAST observes the deployed system but needs a representative environment and can miss
        unreachable paths. Active probing also consumes resources and may change data. Neither
        approach automatically understands every application-specific permission or business rule.
        Check actual tool coverage: both{' '}
        <a href="https://docs.semgrep.dev/semgrep-code/overview">Semgrep Code</a> and{' '}
        <a href="https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning">
          CodeQL
        </a>{' '}
        depend on supported analysis capabilities, not the presence of a badge.
      </p>

      <h2>Tier 1: A baseline you can explain</h2>
      <p>
        Start with fast SAST on supported application code and a scoped, passive dynamic baseline
        against an authorized test environment. Review exclusions and findings instead of enabling
        every rule and ignoring the noise. Use a synthetic unsafe example and its safe counterpart
        to check that the selected rule detects the intended problem without flagging both.
      </p>
      <p>
        <a href="https://www.zaproxy.org/docs/docker/baseline-scan/">ZAP’s baseline scan</a> crawls
        the target and passively analyzes traffic; it does not run the active attack scanner.
        “Passive” does not mean request-free or universally safe for production. Keep crawling
        away from logout, deletion, purchases, and other state-changing routes; use synthetic data
        and an explicit host boundary.
      </p>
      <ul>
        <li><strong>Evidence:</strong> revision, tool and rule versions, exclusions, visited routes, and reviewed findings.</li>
        <li><strong>Limit:</strong> this is narrow initial visibility, not deep exploitation or complete authenticated coverage.</li>
      </ul>

      <h2>Tier 2: Reproducible checks in the delivery path</h2>
      <p>
        Add CI feedback and a fuller analysis cadence appropriate to cost and latency. Deploy the
        same revision into isolated staging, seed representative data, and run approved dynamic
        checks with explicit route scope, rate limits, timeouts, and reset procedures. Disable
        real email, payment, and destructive integrations. Restrict scanner network access so a
        redirect cannot silently turn your test into a probe of someone else’s system.
      </p>
      <p>
        Verify authentication with a protected response and the expected identity—not just a
        successful login request. Test relevant roles separately and confirm protected routes
        were reached. ZAP documents{' '}
        <a href="https://www.zaproxy.org/docs/getting-further/authentication/">authentication</a> and{' '}
        <a href="https://www.zaproxy.org/docs/desktop/start/features/scope/">in-scope contexts</a>;
        configuration still needs validation in your application.
      </p>
      <ul>
        <li><strong>Evidence:</strong> matched code/deployment revision, session checks, coverage, reports, and regression results.</li>
        <li><strong>Limit:</strong> a scanner exit code is not a remediation verdict. Missing authentication, skipped analysis, and tool errors are unknown coverage—not passes.</li>
      </ul>
      <p>
        Reproduce a confirmed issue in the controlled environment, repair the root cause, and rerun
        a targeted regression plus legitimate behavior checks. For injection, parameterize the
        query; adding a scanner payload to a blocklist is not equivalent. Define which
        verified findings block release and give exceptions an owner and expiry.
      </p>

      <h2>Tier 3: Test the rules your business depends on</h2>
      <p>
        Concentrate human review on high-impact behavior: cross-tenant access, object ownership,
        privilege changes, approval order, replay, and concurrent operations. Write an
        actor–resource–action matrix with allowed and forbidden outcomes. A user may be logged in
        correctly and still retrieve another tenant’s record. OWASP’s{' '}
        <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html">
          authorization regression guidance
        </a>{' '}
        provides a useful testing structure.
      </p>
      <p>
        Explore abuse cases manually, then automate discovered invariants where practical.
        “An approver cannot approve their own request” is a better test target than “the page loads.”
        OWASP’s{' '}
        <a href="https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html">
          business logic guidance
        </a>{' '}
        explains why generic scanning alone misses these rules. Add custom static rules for
        organization-specific unsafe patterns, with positive and negative fixtures following{' '}
        <a href="https://docs.semgrep.dev/writing-rules/testing-rules">Semgrep’s rule-testing guidance</a>.
      </p>
      <ul>
        <li><strong>Evidence:</strong> reviewed threat assumptions, permission matrices, tested invariants, and verified fixes.</li>
        <li><strong>Limit:</strong> this is risk-driven assurance work, not a guarantee against unmodeled threats or future changes.</li>
      </ul>
      <p>
        Measure critical route/role coverage, confirmed findings, triage burden, time to verified
        remediation, and failed or skipped runs. Raw alert totals reward noise; meaningful metrics
        show whether the process finds and resolves the risks you care about.
      </p>

      <h2>Keep complementary controls distinct</h2>
      <p>
        Software Composition Analysis checks dependencies for known vulnerabilities;{' '}
        <a href="https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts">
          Dependabot alerts
        </a>{' '}
        are one example.{' '}
        <a href="https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning">
          Secret scanning
        </a>{' '}
        looks for exposed credentials. Neither is a substitute for SAST or DAST, and a
        leaked credential requires revocation or rotation—not merely deleting its file. Keep
        dependency ownership, secret handling, and runtime testing connected without pretending
        they are the same category.
      </p>

      <h2>Validate before you trust the result</h2>
      <ol>
        <li>Authorize the target, set scope, and isolate state-changing or external side effects.</li>
        <li>Check representative unsafe and safe cases; confirm authenticated identity and intended roles.</li>
        <li>Record the revision, environment, tools, rules, and exclusions so results are reproducible.</li>
        <li>Inspect reached routes and analysis errors; distinguish clean, failed, and incomplete runs.</li>
        <li>Verify fixes and legitimate behavior, assign ownership, and sanitize reports before sharing.</li>
      </ol>
      <p>
        The companion{' '}
        <a href="https://github.com/KaylahBuilds/sast-dast-tiered-lab">SAST/DAST Tiered Lab</a> is
        a synthetic Python/SQLite learning project with separate guides for all three tiers,
        paired vulnerable and repaired lookups, a narrow Semgrep rule, and regression tests.
        The fixed tenant context is simulated—not a login or identity provider. Review the repo's{' '}
        <a href="https://github.com/KaylahBuilds/sast-dast-tiered-lab/blob/main/VALIDATION.md">validation record</a>{' '}
        before interpreting its examples as tested scanner integrations. Start with one meaningful risk, prove your test can detect it, and
        prove the fix changes the outcome. That is how security testing earns its place.
      </p>
    </>
  ),
};

export default post;
