import { useId } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import { projects } from '../data/projects.js'
import { workVisuals } from '../data/workVisuals.js'

const ink = '#101017'
const panel = '#171923'
const muted = '#8d929f'
const white = '#f4f1f5'
const outline = '#3a3c48'
const secondary = '#58e0cc'

function Label({ x, y, children, color = muted, size = 11, spacing = 1.5, weight = 500, anchor = 'start' }) {
  return <text x={x} y={y} fill={color} fontSize={size} fontFamily="monospace" letterSpacing={spacing} fontWeight={weight} textAnchor={anchor}>{children}</text>
}

function Window({ x, y, width, height, title, accent, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height={height} rx="4" fill={ink} stroke={outline} />
      <path d={`M0 32H${width}`} stroke={outline} />
      <circle cx="15" cy="16" r="3" fill={accent} />
      <Label x="28" y="20" size={9} spacing={1}>{title}</Label>
      {children}
    </g>
  )
}

function Storage({ x, y, label, accent }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 12 54 0 110 12 54 25Z" fill="#2c3037" stroke={outline} />
      <path d="M0 12V75L54 90V25Z" fill="#1b1e28" stroke={outline} />
      <path d="M54 25V90L110 75V12Z" fill="#12141d" stroke={outline} />
      <path d="M9 33 44 42M9 47 44 56M9 61 44 70" stroke={accent} opacity=".65" />
      <circle cx="98" cy="62" r="3" fill={accent} />
      <Label x="55" y="114" size={9} spacing=".8" color={white} anchor="middle">{label}</Label>
    </g>
  )
}

function ScannerScene({ accent }) {
  return (
    <>
      <path d="M66 378 313 434 573 357" fill="none" stroke={outline} />
      <Storage x="63" y="233" label="OBJECTS" accent={accent} />
      <Storage x="467" y="82" label="FINDINGS" accent={accent} />
      <path d="M163 268H226V225M421 215H512V190" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="5 5" />
      <circle cx="322" cy="231" r="124" fill={panel} stroke={outline} />
      <circle cx="322" cy="231" r="110" fill="none" stroke={accent} strokeDasharray="110 7 5 7" opacity=".65" />
      <circle cx="322" cy="231" r="88" fill={ink} stroke={outline} />
      <path d="M322 107V134M322 328V354M198 231H225M419 231H446" stroke={accent} strokeWidth="2" />
      <path d="M322 231 393 164A100 100 0 0 0 322 131Z" fill={accent} opacity=".09" />
      <path d="m322 231 71-67" stroke={accent} opacity=".6" />
      <g transform="translate(299 192)">
        <rect x="0" y="0" width="47" height="61" rx="2" fill="#252934" stroke={accent} />
        <path d="M10 15H37M10 24H29M10 33H36" stroke={muted} />
        <circle cx="28" cy="48" r="6" fill="none" stroke={accent} strokeWidth="2" />
        <path d="m33 53 9 9" stroke={accent} strokeWidth="3" />
      </g>
      <Label x="262" y="294" color={accent} size={11}>SCAN / REVIEW</Label>
      <Window x="72" y="51" width="224" height="105" title="SCAN SCOPE" accent={accent}>
        <Label x="16" y="56" size={10} color={white}>S3 OBJECT STORAGE</Label>
        <Label x="16" y="78" size={10}>PATTERNS → FINDINGS</Label>
        <path d="M16 90H190" stroke={accent} strokeWidth="2" opacity=".6" />
      </Window>
      <Window x="384" y="323" width="208" height="103" title="REVIEW QUEUE" accent={accent}>
        <Label x="16" y="59" color={accent} size={10}>credential candidate</Label>
        <Label x="16" y="80" size={10}>location · type · context</Label>
      </Window>
      <Label x="214" y="417" size={9}>PREVENTION BY DISCOVERY</Label>
    </>
  )
}

function GitOpsScene({ accent }) {
  return (
    <>
      <path d="M320 117V220M320 220H130V293M320 220V293M320 220H510V293" fill="none" stroke={accent} strokeWidth="2" />
      <Window x="226" y="39" width="188" height="81" title="VERSION CONTROL" accent={accent}>
        <Label x="19" y="59" color={white} size={12}>REVIEW → MERGE</Label>
      </Window>
      <g transform="translate(273 173)">
        <path d="M47 0 94 47 47 94 0 47Z" fill={panel} stroke={accent} strokeWidth="2" />
        <path d="M29 39 47 22 64 39M29 54 47 70 64 54" fill="none" stroke={accent} strokeWidth="2" />
        <Label x="13" y="106" size={9} color={white}>ARGOCD SYNC</Label>
      </g>
      {[{ x: 42, name: 'TEAM A', tint: '#58e0cc' }, { x: 232, name: 'TEAM B', tint: accent }, { x: 422, name: 'TEAM C', tint: '#d3ff45' }].map(({ x, name, tint }) => (
        <g key={name} transform={`translate(${x} 295)`}>
          <rect width="176" height="130" rx="4" fill={ink} stroke={outline} />
          <path d="M0 30H176" stroke={outline} />
          <Label x="14" y="19" color={tint} size={10}>{name}</Label>
          <Label x="96" y="19" size={8} spacing=".5">ISOLATED</Label>
          {[16, 70, 124].map((cx) => <g key={cx}><path d={`M${cx} 58l16-9 16 9v24l-16 9-16-9Z`} fill={panel} stroke={tint} /><path d={`M${cx} 58l16 9 16-9M${cx + 16} 67v24`} stroke={tint} fill="none" opacity=".5" /></g>)}
          <Label x="14" y="115" size={9}>RBAC / OIDC / VAULT</Label>
        </g>
      ))}
      <Label x="54" y="151" size={9} color={secondary}>DECLARED STATE</Label>
      <Label x="455" y="231" size={9}>GUARDED BOUNDARIES</Label>
      <path d="M41 454H599" stroke={outline} />
      <Label x="42" y="471" size={9}>SHARED PLATFORM. CLEAR OWNERSHIP.</Label>
    </>
  )
}

function SignalsScene({ accent }) {
  return (
    <>
      <Window x="58" y="54" width="518" height="335" title="OBSERVABILITY / SIGNAL EXPLORER" accent={accent}>
        <Label x="21" y="60" size={10} color={white}>METRICS</Label>
        <path d="M22 78H488M22 111H488M22 145H488M22 178H488" stroke={outline} opacity=".5" />
        <path d="M22 159 47 150 67 154 89 126 110 138 131 136 157 147 178 121 201 125 222 78 239 131 262 143 288 132 312 151 336 126 359 139 380 124 410 132 433 103 453 110 486 93" fill="none" stroke={accent} strokeWidth="2.5" />
        <path d="M222 77V183" stroke="#f24aa8" strokeDasharray="3 5" opacity=".8" />
        <circle cx="222" cy="78" r="5" fill="#f24aa8" />
        <Label x="247" y="88" color="#f24aa8" size={9}>FOLLOW THE SIGNAL</Label>
        <path d="M21 199H497" stroke={outline} />
        <Label x="21" y="222" color={white} size={10}>LOGS</Label>
        <Label x="21" y="245" size={9} spacing=".5">service / request / context / event</Label>
        <Label x="21" y="265" color={accent} size={9} spacing=".5">search → correlate → investigate</Label>
        <Label x="21" y="288" color={white} size={10}>TRACES</Label>
        <path d="M97 282H267M134 296H312M181 310H395" stroke={accent} strokeWidth="7" opacity=".45" />
      </Window>
      <Window x="326" y="341" width="269" height="96" title="INVESTIGATION CONTEXT" accent={accent}>
        <Label x="15" y="58" size={10} color={white}>ONE CONNECTED PICTURE</Label>
        <Label x="15" y="79" size={9}>logs + metrics + traces</Label>
      </Window>
      <Label x="57" y="420" size={9}>VISIBILITY BEFORE GUESSWORK</Label>
      <path d="M34 101V425H270" fill="none" stroke={accent} opacity=".25" />
    </>
  )
}

function TerraformScene({ accent }) {
  return (
    <>
      <Storage x="455" y="52" label="INFRASTRUCTURE" accent={accent} />
      <Storage x="492" y="166" label="STATE" accent={secondary} />
      <path d="M415 134H481M443 298H512V256" fill="none" stroke={accent} strokeDasharray="5 5" />
      <Window x="49" y="74" width="365" height="286" title="TERRAFORM / CHANGE PLAN" accent={accent}>
        <Label x="22" y="65" color={white} size={13} spacing=".6">$ terraform plan</Label>
        <Label x="22" y="96" color={muted} size={11} spacing=".3"># desired state, made explicit</Label>
        <Label x="22" y="132" color={accent} size={12} spacing=".3">+ resource "aws_vpc" "platform"</Label>
        <Label x="22" y="155" color={accent} size={12} spacing=".3">+ resource "aws_iam_role" "team"</Label>
        <Label x="22" y="191" color={secondary} size={12} spacing=".3">~ policy: review proposed change</Label>
        <path d="M22 212H341" stroke={outline} />
        <Label x="22" y="239" size={10}>VERSIONED / REVIEWED / REPEATABLE</Label>
        <rect x="22" y="253" width="54" height="3" fill={accent} />
      </Window>
      <g transform="translate(112 390)">
        <path d="M0 0H413" stroke={outline} />
        {[{ x: 0, label: 'DECLARE' }, { x: 155, label: 'REVIEW' }, { x: 310, label: 'APPLY' }].map(({ x, label }) => (
          <g key={label} transform={`translate(${x} 0)`}><circle r="5" fill={ink} stroke={accent} /><Label x="-23" y="26" size={9} color={white}>{label}</Label></g>
        ))}
      </g>
      <Label x="49" y="52" size={9} color={accent}>THE PLAN IS THE PAPER TRAIL</Label>
    </>
  )
}

function AgentNode({ x, y, title, sub, accent, shape = false }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="167" height="74" rx="4" fill={ink} stroke={shape ? accent : outline} />
      <rect x="0" y="0" width="3" height="74" fill={accent} />
      <Label x="15" y="30" color={white} size={11} spacing="1">{title}</Label>
      <Label x="15" y="52" size={9} spacing=".5">{sub}</Label>
    </g>
  )
}

function AgentsScene({ accent }) {
  return (
    <>
      <path d="M320 128V164M183 247H235M405 247H455M320 329V367" fill="none" stroke={accent} strokeWidth="2" />
      <path d="M114 286V406H237M539 286V406H404" fill="none" stroke={outline} strokeDasharray="5 5" />
      <AgentNode x="237" y="54" title="DEVELOPER TASK" sub="intent / constraints" accent={accent} />
      <AgentNode x="29" y="210" title="CONTEXT" sub="docs / repository" accent={secondary} />
      <AgentNode x="445" y="210" title="TOOLS" sub="bounded actions" accent="#d3ff45" />
      <g transform="translate(236 163)">
        <path d="M84 0 168 84 84 168 0 84Z" fill={panel} stroke={accent} />
        <path d="m84 20 64 64-64 64-64-64Z" fill="none" stroke={accent} opacity=".2" />
        <Label x="45" y="78" color={accent} size={14} spacing="2">AGENT</Label>
        <Label x="25" y="100" size={9}>PLAN / ACT / CHECK</Label>
      </g>
      <AgentNode x="237" y="369" title="HUMAN REVIEW" sub="judgment stays human" accent={accent} shape />
      <Label x="30" y="97" size={9} color={accent}>WORKFLOW EXPERIMENT</Label>
      <Label x="29" y="454" size={9}>STRUCTURED WORK. ROOM FOR HARD PROBLEMS.</Label>
      <circle cx="320" cy="148" r="3" fill={accent} />
      <circle cx="320" cy="350" r="3" fill={accent} />
    </>
  )
}

function ResearchScene({ accent }) {
  return (
    <>
      <path d="M30 39H610V440H30Z" fill="#14161d" stroke={outline} />
      <path d="M51 63H590M51 415H590" stroke={outline} strokeDasharray="2 7" />
      <Label x="52" y="90" size={10} color={accent}>CASE BOARD / RESEARCH IN PROGRESS</Label>
      <path d="m172 168 264 42-133 126M303 336l-131-168M436 210l40 151" fill="none" stroke="#f24aa8" opacity=".6" />
      <g transform="translate(68 123) rotate(-5 92 72)">
        <rect width="184" height="134" fill="#202530" stroke={outline} />
        <circle cx="92" cy="9" r="4" fill={accent} />
        <Label x="15" y="33" color={white} size={11}>BINARY / ARTIFACT</Label>
        <Label x="15" y="59" size={10} spacing=".5">48 89 E5 · 31 C0</Label>
        <path d="M16 75H151M16 87H125M16 99H160" stroke={accent} opacity=".45" />
        <Label x="15" y="120" size={8}>FOLLOW THE BEHAVIOR</Label>
      </g>
      <g transform="translate(352 133) rotate(6 101 72)">
        <rect width="202" height="141" fill={ink} stroke={outline} />
        <circle cx="101" cy="9" r="4" fill="#f24aa8" />
        <Label x="17" y="35" color={white} size={11}>HYPOTHESIS</Label>
        <Label x="17" y="61" size={10} spacing=".2">Where does trust break?</Label>
        <Label x="17" y="84" size={10} spacing=".2">What would reveal it?</Label>
        <path d="M17 106H178" stroke={accent} />
        <Label x="17" y="126" size={8}>TEST / RECORD / REVISE</Label>
      </g>
      <g transform="translate(224 290) rotate(-2 123 61)">
        <path d="M0 12V0H78L95 12H246V119H0Z" fill="#242a2d" stroke={accent} />
        <Label x="20" y="45" color={accent} size={12}>DETECTION IDEAS</Label>
        <Label x="20" y="70" size={10} spacing=".4">artifact → behavior → signal</Label>
        <Label x="20" y="95" size={9}>NOTES BECOME BETTER DEFENSE</Label>
      </g>
      <Label x="51" y="463" size={9}>REVERSE ENGINEERING / CTF / DETECTION</Label>
    </>
  )
}

const scenes = { scanner: ScannerScene, gitops: GitOpsScene, signals: SignalsScene, terraform: TerraformScene, agents: AgentsScene, research: ResearchScene }

export function ProjectDiagram({ slug, index }) {
  const uid = useId().replace(/:/g, '')
  const visual = workVisuals[slug]
  if (!visual) return null
  const Scene = scenes[visual.scene]
  if (!Scene) return null
  const position = index ?? projects.findIndex((project) => project.slug === slug)
  return (
    <figure className={`work-visual work-visual-${visual.scene}`} style={{ '--work-accent': visual.accent }}>
      <div className="work-visual-label"><span>FIELD VIEW / {String(position + 1).padStart(2, '0')}</span><span>ILLUSTRATIVE</span></div>
      <svg viewBox="0 0 640 490" aria-hidden="true" focusable="false" className="work-art">
        <defs>
          <pattern id={`${uid}-grid`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#414454" strokeWidth=".5" /></pattern>
          <radialGradient id={`${uid}-glow`}><stop offset="0" stopColor={visual.accent} stopOpacity=".12" /><stop offset="1" stopColor={visual.accent} stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="640" height="490" fill={`url(#${uid}-grid)`} opacity=".32" />
        <ellipse cx="338" cy="251" rx="294" ry="232" fill={`url(#${uid}-glow)`} />
        <Scene accent={visual.accent} />
      </svg>
      <figcaption>{visual.caption}</figcaption>
    </figure>
  )
}

export default function WorkShowcase({ limit }) {
  const selected = Number.isFinite(limit) ? projects.slice(0, Math.max(0, Math.floor(limit))) : projects
  return (
    <div className="work-showcase">
      {selected.map((project, index) => {
        const visual = workVisuals[project.slug] ?? { name: project.title, eyebrow: 'Engineering / Case study', accent: secondary }
        const number = String(index + 1).padStart(2, '0')
        return (
          <Reveal key={project.slug}>
            <article className={`work-row${index % 2 ? ' work-row-reverse' : ''}`} style={{ '--work-accent': visual.accent }} aria-labelledby={`work-${project.slug}`}>
              <div className="work-copy">
                <span className="work-number" aria-hidden="true">{number}</span>
                <p className="work-eyebrow">CASE {number} <span aria-hidden="true">/</span> {visual.eyebrow}</p>
                <h2 className="work-name" id={`work-${project.slug}`}>{visual.name}</h2>
                <p className="work-lead">{project.title}</p>
                <p className="work-description">{project.description}</p>
                <ul className="work-tags" aria-label="Project technologies">
                  {project.tags.map((tag) => <li key={tag.label} data-tone={tag.color ?? 'default'}>{tag.label}</li>)}
                </ul>
                <Link className="work-case-link" to={`/projects/${project.slug}`}>Read the blog <span aria-hidden="true">↗</span><span className="sr-only">: {project.title}</span></Link>
              </div>
              <ProjectDiagram slug={project.slug} index={index} />
            </article>
          </Reveal>
        )
      })}
    </div>
  )
}
