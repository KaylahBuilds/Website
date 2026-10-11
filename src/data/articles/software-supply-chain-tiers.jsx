const post = {
  slug: 'software-supply-chain-security-tiers',
  title: 'Software Supply Chain Security: Three Tiers from Inputs to Verified Releases',
  date: '2026-10-10',
  tags: ['security', 'supply-chain', 'CI/CD'],
  excerpt:
    'Know your inputs, protect the build, and verify what you release: a practical framework for supply-chain controls with evidence and honest limits.',
  body: (
    <>
      <p className="section-label">Software supply chain / trust with receipts</p>
      <p>
        Your application is more than its source code. Dependencies, build tools, workflow actions,
        runners, caches, and release storage can all change what reaches a user. Reviewing the
        application while trusting every surrounding step leaves a gap. OWASP’s{' '}
        <a href="https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html">
          software supply chain guidance
        </a>{' '}
        treats these as connected security boundaries—not simply a dependency-scanning problem.
      </p>
      <p>
        The following tiers are a practical adoption framework: understand inputs, protect their
        transformation, and verify release evidence. They are cumulative practices, not a
        certification or a claim that a project satisfies a formal security level.
      </p>

      <h2>Our tiers are not SLSA Build levels</h2>
      <p>
        The approved{' '}
        <a href="https://slsa.dev/spec/v1.2/">SLSA 1.2 specification</a> has its own tracks and
        requirements. Its{' '}
        <a href="https://slsa.dev/spec/v1.2/build-track-basics">Build track</a> progresses from
        L1, where provenance describes how an artifact was built, to L2, where a hosted platform
        generates and signs provenance and consumers validate authenticity. L3 adds a hardened
        platform that isolates runs and prevents user-defined build steps from accessing provenance
        signing material. An unsigned L1 record offers no tamper protection. The labels below do
        not map one-to-one to those levels; a checklist or working signing action alone does not
        establish SLSA achievement.
      </p>
      <div
        className="article-table-wrap"
        role="region"
        aria-label="Software supply chain adoption tiers"
        tabIndex={0}
      >
        <table className="article-comparison">
          <caption>Each tier strengthens a different trust boundary.</caption>
          <thead>
            <tr>
              <th scope="col">Tier</th>
              <th scope="col">Question</th>
              <th scope="col">Useful evidence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1 / Inputs</th>
              <td>What did we choose to consume?</td>
              <td>Reviewed locks, digests, dependency changes, and scoped SBOM</td>
            </tr>
            <tr>
              <th scope="row">2 / Build</th>
              <td>Who can influence the transformation?</td>
              <td>Permissions, trust boundaries, build inputs, and repeat-build comparison</td>
            </tr>
            <tr>
              <th scope="row">3 / Release</th>
              <td>Does this exact artifact meet our expectations?</td>
              <td>Verified provenance, authorized identity, digest, and release decision</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Tier 1: Know and review your inputs</h2>
      <p>
        Inventory direct and transitive dependencies, build tools, base images, and workflow
        components. Use the ecosystem’s lockfile and locked-install mode where available; verify
        supported package hashes against reviewed expectations. Pin container images by digest
        and review dependency updates as changes—not as routine approvals. Tests still matter
        when an update is labeled a security fix.
      </p>
      <p>
        Generate a release-associated SBOM with component identities, versions, and dependency
        relationships.{' '}
        <a href="https://cyclonedx.org/capabilities/sbom/">CycloneDX</a> provides a machine-readable
        format for that inventory. State its scope: an application-library list may omit the
        operating system, build tools, or dynamically fetched plugins. An SBOM is not a
        vulnerability verdict; correlate it with current advisories and your actual exposure.
      </p>
      <ul>
        <li><strong>Evidence:</strong> reviewed lockfile diffs, input digests, update decisions, and a dated SBOM tied to the release.</li>
        <li><strong>Limit:</strong> pinning stabilizes a choice; it does not make that choice safe. A digest only checks integrity against an expectation you must trust.</li>
      </ul>
      <p>
        <a href="https://scorecard.dev/">OpenSSF Scorecard</a> can add signals about repository
        practices. Treat those signals as review inputs, not a guarantee that a dependency is
        benign. Assign an owner to updates and time-bound any accepted risk.
      </p>

      <h2>Tier 2: Protect the build, not just its configuration</h2>
      <p>
        Give ordinary test jobs minimal permissions. Keep publishing credentials and signing
        capabilities in a separate, protected release path. Review workflow changes and pin
        third-party actions to verified, full-length commit SHAs, with a process to update those
        pins. GitHub’s{' '}
        <a href="https://docs.github.com/en/actions/reference/security/secure-use">secure-use guidance</a>{' '}
        explains why workflow dependencies and token privileges deserve the same scrutiny as
        application code.
      </p>
      <p>
        Treat a contributor’s pull request as untrusted execution. A test command, package install,
        or build script can run attacker-controlled code. Do not execute it in a privileged{' '}
        <code>pull_request_target</code> context with release secrets. Separate review-time checks
        from release authority; GitHub documents the{' '}
        <a href="https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target">
          untrusted pull-request boundary
        </a>.
      </p>
      <p>
        Protect caches too. Never cache secrets, restrict writes by trust level, and treat restored
        files as untrusted input. A lockfile-based cache key is useful organization, not proof that
        restored bytes are authentic. See{' '}
        <a href="https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching">
          GitHub’s cache security guidance
        </a>.
      </p>
      <p>
        Define build inputs and environment, remove accidental timestamps and unstable ordering,
        then compare independent rebuilds.{' '}
        <a href="https://reproducible-builds.org/docs/definition/">Reproducible builds</a> require
        matching outputs from the specified inputs and environment. Two matching local ZIPs
        demonstrate determinism in that exercise—not independent trust in the builder.
      </p>
      <ul>
        <li><strong>Evidence:</strong> reviewed permissions and triggers, runner isolation, cache boundaries, build metadata, and repeat-build digests.</li>
        <li><strong>Limit:</strong> a pinned malicious action remains malicious. Reproducibility cannot make compromised inputs or a compromised builder trustworthy.</li>
      </ul>

      <h2>Tier 3: Verify the release against explicit expectations</h2>
      <p>
        Produce cryptographically verifiable provenance through an authorized build platform and
        verify it before promotion. Check the actual artifact digest, trusted signing identity and
        issuer, expected repository and workflow, source revision, and permitted build parameters.
        Decide which builders you trust; do not let an artifact choose its own authority. SLSA’s{' '}
        <a href="https://slsa.dev/spec/v1.2/verifying-artifacts">artifact verification guidance</a>{' '}
        separates authentic evidence from whether that evidence matches your expectations.
      </p>
      <p>
        <a href="https://docs.github.com/en/actions/concepts/security/artifact-attestations">
          GitHub artifact attestations
        </a>{' '}
        and{' '}
        <a href="https://docs.sigstore.dev/cosign/verifying/verify/">Sigstore verification</a>{' '}
        support this workflow. Verification must constrain the expected identity and artifact,
        not merely accept any valid signature. A signed vulnerable program remains vulnerable;
        authenticity is not code quality.
      </p>
      <ul>
        <li><strong>Evidence:</strong> verification results, approved builder policy, bound artifact digest, provenance, and the recorded promotion decision.</li>
        <li><strong>Limit:</strong> generation without enforcement is passive documentation. Compromised authorized identities and flaws outside the policy remain risks.</li>
      </ul>
      <p>
        Test rejection as well as acceptance: change an artifact byte, present evidence from the
        wrong identity, omit required provenance, or supply an unexpected source revision. The
        release gate should stop. Keep exceptions explicit, approved, and expiring—not a permanent
        fallback that silently publishes when verification fails.
      </p>

      <h2>Inventory must lead to response</h2>
      <p>
        Connect deployed artifact digests to SBOMs, source revisions, and release owners. When a
        component is compromised, determine affected releases, block promotion, rebuild from
        reviewed inputs, and replace affected deployments. Rotate exposed credentials and
        preserve investigation evidence. Measure inventory coverage, rejected unauthorized
        releases, exception age, and time to containment—not simply how many SBOMs were generated.
      </p>

      <h2>A deliberately small companion lab</h2>
      <p>
        The{' '}
        <a href="https://github.com/KaylahBuilds/software-supply-chain-tiered-lab">
          Software Supply Chain Tiered Lab
        </a>{' '}
        provides runnable offline Python exercises using synthetic components,
        locked digests, deterministic ZIPs, a narrowly scoped SBOM, and an unsigned build record.
        That JSON record is editable evidence—not cryptographically verified provenance. The
        separate GitHub attestation template is not activated, and no live attestations or SLSA
        level achievement are claimed.
      </p>
      <p>
        Start by changing an input without updating its reviewed digest. Then rebuild twice and
        compare the outputs. Finally, inspect what the unsigned record cannot prove. Combine this
        work with{' '}
        <a href="/#/blog/sast-vs-dast-security-testing-tiers">SAST and DAST</a>,{' '}
        <a href="/#/blog/ghas-controls-automation-remediation">GitHub security controls</a>, and{' '}
        <a href="/#/blog/woodpecker-hardened-ci-pipelines">hardened CI pipelines</a>. A trustworthy
        supply chain needs both safer software and credible evidence of how it reached the user.
      </p>
    </>
  ),
};

export default post;
