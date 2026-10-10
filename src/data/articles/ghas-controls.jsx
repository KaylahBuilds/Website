export default {
  slug: 'ghas-controls-automation-remediation',
  title: 'Security Alerts Are Not a Security Strategy: Making GitHub Controls Count',
  date: '2026-10-10',
  tags: ['security', 'GitHub', 'devsecops'],
  excerpt:
    'A hands-on GitHub security lab that connects detection, safe automation, enforceable review, and fixes you can actually verify.',
  body: (
    <>
      <p className="section-label">Security lab series / 01</p>
      <p>
        A repository can display a green workflow badge while shipping a vulnerable dependency. It can
        report a leaked credential while that credential remains active. Security tooling creates
        useful signals; engineering decisions turn those signals into protection.
      </p>
      <p>
        The GHAS Controls Lab explores that gap with a runnable, audit-first workflow. Its examples
        connect GitHub settings to practical remediation instead of treating feature enablement as
        the finish line. The project currently has 23 passing offline tests. It remains local, with
        source publication pending: no live repository settings were changed, and no GitHub CI or
        scanning runs were performed to validate it.
      </p>

      <h2>Know what you are enabling</h2>
      <p>
        GitHub Advanced Security is not one universal switch. GitHub Code Security and GitHub Secret
        Protection are separate products, available to eligible Team or Enterprise accounts.
        Private and internal repositories need the relevant entitlement. Public GitHub.com
        repositories have a free subset, including code scanning, secret scanning, and dependency
        review; dependency graph and Dependabot alerts are core features. A personal private
        repository should not be assumed eligible for paid organization features. Check the{' '}
        <a href="https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security">
          official product availability
        </a>{' '}
        before promising a rollout.
      </p>

      <h2>Put each control at the right boundary</h2>
      <ul>
        <li>
          <strong>CodeQL:</strong> examines supported code for modeled vulnerability patterns.
          Without static analysis, a dangerous path may reach release unnoticed. Coverage depends
          on language, build configuration, and review of findings.
        </li>
        <li>
          <strong>Dependabot:</strong> surfaces known vulnerable dependencies and can propose
          security updates. Without ownership, even an available fix can sit untouched.
        </li>
        <li>
          <strong>Dependency review:</strong> checks dependency changes before merge. It complements
          existing-dependency alerts, rather than replacing them. Supported manifests and usable
          dependency data matter. See{' '}
          <a href="https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review">
            GitHub’s dependency review guidance
          </a>.
        </li>
        <li>
          <strong>Secret scanning and push protection:</strong> detect supported credentials and
          intercept supported leaks. Missing these controls can lengthen exposure; enabling them
          does not cover every possible secret or remove the need to govern bypasses.
        </li>
      </ul>
      <p>
        The tradeoff is real: runner time, licensing where applicable, alert triage, false-positive
        review, and upgrade maintenance. The risk of leaving controls off is lost visibility and
        fewer interception points—not proof that every unscanned repository is compromised.
      </p>

      <h2>Audit first. Apply narrowly.</h2>
      <p>
        The lab’s Python runner targets one explicitly named repository. Fixture mode works
        offline; live mode uses an existing GitHub CLI login and defaults to read-only calls.
        Reports contain allowlisted settings, not exposed secret values. Missing permissions and
        ambiguous responses remain unknown rather than being mislabeled as disabled.
      </p>
      <pre><code>{`python tools/run_tests.py
python tools/audit_repo.py --repo example-owner/controls-lab \\
  --fixture fixtures/public-disabled.json`}</code></pre>
      <p>
        Real writes require both <code>--apply</code> and an exact repository confirmation. The
        allowed operations are deliberately limited: Dependabot alerts, security-update PRs, and
        push protection when secret scanning already exists. The tool does not purchase products,
        enable paid scanning, merge PRs, or rewrite history.
      </p>

      <h2>Fix the behavior, not the alert count</h2>
      <h3>A query needs two separate protections</h3>
      <p>
        The SQL exercise starts with an unsafe lookup that concatenates an email and omits tenant
        scope. The safe implementation binds both values:
      </p>
      <pre><code>{`connection.execute(
    "SELECT id, email FROM users WHERE tenant_id = ? AND email = ?",
    (authorized_tenant_id, email),
).fetchone()`}</code></pre>
      <p>
        Parameter binding prevents the email from becoming executable SQL. Trusted tenant scope
        prevents a different authorization failure. That scope must come from the authorization
        layer, not an unverified request parameter. In-memory regression tests cover injection,
        cross-tenant isolation, and ordinary allowed lookups.
      </p>
      <h3>Different findings need different repairs</h3>
      <p>
        For a dependency alert, inspect the affected range, update the manifest and lockfile,
        review compatibility, test, and verify the patched artifact reaches deployment. For a
        leaked credential, revoke or rotate it at its provider first. Deleting the file cannot
        invalidate copies already held elsewhere. GitHub’s{' '}
        <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository">
          sensitive-data cleanup guidance
        </a>{' '}
        makes that containment distinction explicit.
      </p>

      <h2>Make the merge gate real</h2>
      <p>
        Workflow templates end in <code>.example</code> and use manual triggers, so publication
        alone activates nothing. The ruleset example starts disabled. Before requiring a check,
        ensure it runs on every relevant PR and confirm a failing sandbox change blocks merging.
        A successful analysis job is not a zero-vulnerability assertion.
      </p>
      <p>
        Actions are pinned to full commit SHAs, but pins still need reviewed updates. Keep workflow
        permissions minimal and never execute untrusted PR code in a privileged context. These
        choices follow GitHub’s{' '}
        <a href="https://docs.github.com/en/actions/reference/security/secure-use">
          secure workflow guidance
        </a>.
      </p>

      <h2>Try the decision before the deployment</h2>
      <p>
        Run both offline fixtures, including the private-unlicensed case. Explain which controls
        are available, which settings are unknown, and what authority a write requires. Then run
        the SQL tests and write a short remediation note identifying the fix, verification evidence,
        and remaining limitations. That is the useful outcome: a reviewable security decision.
      </p>
      <p>
        Continue the series with{' '}
        <a href="/#/blog/woodpecker-hardened-ci-pipelines">hardened Woodpecker pipelines</a>,{' '}
        <a href="/#/blog/prowler-kubernetes-multicloud-scanning">scoped Prowler cloud scanning</a>,
        and <a href="/#/blog/kubernetes-opa-eks-aks">Kubernetes policy on EKS and AKS</a>.
      </p>
    </>
  ),
}
