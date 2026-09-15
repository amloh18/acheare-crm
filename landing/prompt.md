Design System

# ACHARE DESIGN + MOTION SYSTEM

```text
You are designing and implementing the Achare public marketing website.

Achare is an all-in-one CRM and people-operations platform.

Brand:
ACHARE

Tagline:
People. Process. Progress.

Product modules:
CRM
Recruitment
Jobs
Employees
Time Tracking
Payroll
Documents
Reports

============================================================
01. DESIGN PHILOSOPHY
============================================================

The visual direction is inspired by premium editorial SaaS and
the Catalyze AI Webflow design language.

IMPORTANT:

Do not make the website look like an "AI-generated SaaS website".

Do not use:
- excessive glassmorphism
- dark cyberpunk backgrounds
- excessive neon
- random 3D objects
- giant glowing gradients
- generic dashboard screenshots
- excessive floating cards
- excessive border-radius
- generic stock SaaS illustrations
- animation on every element

Instead use:

- strong typography
- large whitespace
- editorial compositions
- asymmetrical layouts
- clean product UI
- soft pastel shapes
- geometric accents
- selective photography
- subtle gradients
- clean lines
- data-driven animation
- hover-driven UI behavior
- scroll storytelling
- carefully choreographed transitions

The website should feel:

Human
Modern
Premium
Confident
Friendly
Intelligent
Operational
Trustworthy

The visual principle:

MINIMAL STRUCTURE
+
EXPRESSIVE TYPE
+
REAL PRODUCT UI
+
COLORFUL ACCENTS
+
PURPOSEFUL MOTION

Motion must explain the product.

It must never exist simply because animation is possible.
```

---

# 02. DESIGN TOKENS

```text
COLOR SYSTEM
```

### Base

```css
--color-bg: #F8F8F5;
--color-surface: #FFFFFF;
--color-surface-soft: #F3F4F1;

--color-text: #111318;
--color-text-secondary: #626873;
--color-text-muted: #9297A1;

--color-border: #E6E7E3;
```

### Achare accent

```css
--color-blue: #4169F5;
--color-violet: #8566F5;
--color-green: #68D39A;
```

### Feature colors

```css
--recruitment: #8B6CF6;
--jobs: #FF8A45;
--employees: #F2C94C;
--time: #36B978;
--payroll: #8066E8;
--documents: #E96BA8;
```

### Soft backgrounds

```css
--soft-blue: #E4EBFF;
--soft-violet: #EAE2FF;
--soft-green: #DDF4E6;
--soft-orange: #FFE4CF;
--soft-yellow: #FFF1BE;
--soft-pink: #FBE0EC;
```

The feature colors should appear as **small visual signals**, not giant backgrounds.

---

# 03. TYPOGRAPHY SYSTEM

Use:

```text
Primary:
Inter / Geist / Satoshi / Manrope

Choose ONE.
Do not mix fonts unnecessarily.
```

### Display

```text
Hero:
80–104px

Hero line-height:
0.92–1.0

Weight:
600–700
```

### H2

```text
56–72px
line-height: 0.95–1.05
```

### H3

```text
32–44px
```

### Body

```text
17–19px
line-height: 1.55
```

### Labels

```text
11–13px
letter-spacing: 0.12em
uppercase
```

Feature labels should feel editorial:

```text
01  RECRUITMENT CRM
02  JOBS
03  EMPLOYEES
04  TIME TRACKING
05  PAYROLL
06  DOCUMENTS
```

---

# 04. GRID

Use a strict grid.

Desktop:

```text
max-width: 1320px
12 columns
24px gutters
```

Large desktop:

```text
max-width: 1440px
```

Tablet:

```text
8 columns
```

Mobile:

```text
4 columns
16px side padding
```

Never let content stretch endlessly across the screen.

Whitespace is part of the design.

---

# 05. BORDER RADIUS

Avoid making everything a giant pill.

Use:

```text
Buttons:
12px

Small UI:
10–14px

Cards:
18–24px

Large feature panels:
28–36px

Images:
20–28px
```

Pills only for:

* tags
* status
* filters
* toggles
* small badges

---

# 06. SHADOW SYSTEM

Very restrained.

```css
--shadow-sm:
0 2px 8px rgba(20, 25, 40, .05);

--shadow-md:
0 10px 30px rgba(20, 25, 40, .08);

--shadow-lg:
0 24px 70px rgba(20, 25, 40, .10);
```

Do not make every card look like it is floating three inches above the page.

---

# 07. GEOMETRIC LANGUAGE

Create a reusable decorative system.

Shapes:

* circles
* half circles
* quarter circles
* triangles
* rounded rectangles
* dotted grids
* tiny crosses
* curved arrows
* underlines

Use them to frame content.

Example:

```text
          △
      __________
     /          \
    |   PRODUCT  |
     \__________/
       ●
```

Shapes should sit behind UI and photography.

They should rarely compete with content.

---

# 08. HAND-DRAWN DETAILS

Use very sparingly.

Examples:

```text
One person.
One record.
One timeline.
             ↗
```

or:

```text
Great people
build great companies.
        ↗
```

Use an intentionally imperfect SVG stroke.

Animate the stroke using:

```text
stroke-dasharray
stroke-dashoffset
```

When the section enters viewport:

the arrow draws itself.

Do NOT use handwritten fonts throughout the website.

Only use them as annotation accents.

---

# 09. MOTION PRINCIPLE

Every animation belongs to one of four categories.

### 1. ENTER

Element arrives.

### 2. RESPOND

Element reacts to user interaction.

### 3. PROGRESS

Element communicates a process.

### 4. TRANSFORM

Element changes state.

Do not animate just to make something move.

---

# 10. MOTION TOKENS

Create a global motion system.

```text
Instant:
120ms

Micro:
180ms

Fast:
240ms

Standard:
360ms

Smooth:
500ms

Large:
700ms

Cinematic:
900–1200ms
```

Easing:

```text
easeOut:
cubic-bezier(.22,1,.36,1)

smooth:
cubic-bezier(.16,1,.3,1)

soft:
cubic-bezier(.25,.8,.25,1)
```

Avoid linear easing except for continuous loops.

---

# 11. PAGE LOAD EXPERIENCE

Do NOT create a long loading animation.

The page should become useful quickly.

### Initial load

Background:

off-white.

Achare logo appears.

Small progress line:

```text
──────────
```

Animate from:

```text
0 → 100%
```

Duration:

500–700ms.

Then:

Logo moves subtly upward.

Hero content reveals.

Sequence:

```text
Logo
↓
Eyebrow
↓
Headline
↓
Description
↓
CTA
↓
Hero UI
↓
Floating cards
```

Stagger:

```text
80–120ms
```

The entire hero should settle within approximately:

```text
900–1200ms
```

No long splash screen.

---

# 12. HERO MOTION

Hero should feel alive immediately.

### Headline

Reveal by line.

Do NOT letter-by-letter animate the headline.

Use:

```text
opacity: 0 → 1
translateY: 30px → 0
```

Duration:

600ms.

### Dashboard

Start:

```text
opacity: 0
scale: .96
translateY: 30px
```

End:

```text
opacity: 1
scale: 1
translateY: 0
```

### Dashboard floating

After entering:

```text
translateY(-6px)
→
translateY(4px)
→
translateY(-6px)
```

Duration:

6–8 seconds.

Infinite.

Very subtle.

### Floating cards

Different timing.

Candidate:

4.8s

Payroll:

5.7s

Time:

6.4s

Never synchronize all objects.

That creates organic movement.

---

# 13. CURSOR MOTION

Desktop only.

Hero decorative elements respond to pointer.

Example:

```text
large circle:
±6px

small circle:
±12px

dashboard:
±3px

decorative triangle:
±8px
```

Use interpolation.

Do not make the entire page chase the cursor.

The effect should barely be noticed.

---

# 14. BUTTON SYSTEM

Primary button:

```text
black / near-black
white text
```

Example:

```text
Buy Achare →
```

Hover:

```text
translateY(-2px)
shadow increases
arrow moves +4px
```

Arrow:

```text
→
```

becomes:

```text
→
```

with the arrow physically translating.

Duration:

180–240ms.

### Press

```text
scale(.98)
```

Duration:

100ms.

### Secondary button

White/off-white.

Thin border.

Hover:

```text
background slightly darker
border becomes stronger
arrow moves
```

---

# 15. NAVIGATION MOTION

At page top:

transparent.

On scroll:

```text
background: rgba(255,255,255,.86)
backdrop-filter: blur(12px)
border-bottom: 1px solid
```

Animate:

```text
height
background
shadow
```

Duration:

250ms.

Do not use a huge animated navbar.

---

# 16. NAV DROPDOWNS

Dropdown should not suddenly appear.

Animation:

```text
opacity:
0 → 1

translateY:
-6px → 0

scale:
.98 → 1
```

Duration:

180ms.

Menu items:

on hover:

small arrow or indicator moves 3px.

---

# 17. SCROLL REVEAL SYSTEM

Create a reusable:

```text
RevealOnScroll
```

component.

Default:

```text
opacity: 0
translateY: 32px
```

To:

```text
opacity: 1
translateY: 0
```

Duration:

600ms.

Stagger children:

100ms.

Important:

Do NOT reveal every paragraph separately.

Reveal groups.

Example:

```text
section label
headline
description
CTA
```

as one choreographed group.

---

# 18. FEATURE SECTION MOTION

This is where the Catalyze-style philosophy becomes important.

Each feature should feel like a mini product demonstration.

Not:

```text
fade in image
fade in text
```

Instead:

```text
section enters
↓
background shape appears
↓
UI frame enters
↓
UI elements populate
↓
data animates
↓
annotation draws
```

---

# 19. RECRUITMENT ANIMATION

Feature:

```text
01
RECRUITMENT CRM

Turn hiring into
a growth engine.
```

Visual:

Candidate pipeline.

When entering viewport:

### Step 1

Pipeline frame appears.

### Step 2

Columns fade in.

### Step 3

Candidate cards appear.

### Step 4

One candidate moves.

```text
Screening
      ↓
Interview
```

Animate with:

```text
translateX
scale
opacity
```

### Step 5

Metric:

```text
Time to Hire

18%
```

counter animates:

```text
0 → 18
```

Arrow draws.

This makes the animation communicate recruitment.

---

# 20. JOBS ANIMATION

Job card:

```text
Frontend Developer
Engineering · Full-time
```

On section entrance:

card appears.

Candidate avatars slide in one by one.

Then:

```text
12 Candidates
```

counter:

```text
0 → 12
```

Status pill:

```text
Open
```

soft pulse once.

Do not loop the whole animation.

---

# 21. EMPLOYEE ANIMATION

Employee card:

```text
Aisha Khan
UI/UX Designer
```

Tabs:

```text
Profile
Employment
Attendance
Payroll
Documents
Activity
```

Tabs should be genuinely interactive.

When clicked:

old content:

```text
opacity 1
x 0
```

to:

```text
opacity 0
x -8
```

New content:

```text
opacity 0
x 8
```

to:

```text
opacity 1
x 0
```

Duration:

250ms.

Active indicator slides between tabs.

This is much better than a decorative employee card.

---

# 22. TIME TRACKING

Show:

```text
Clock In
09:02 AM
```

When section appears:

clock hand moves.

Then:

```text
This Week
38h 12m
```

counter animates.

Chart bars grow:

```text
height: 0
→
actual height
```

stagger:

80ms.

Do this once.

Do not constantly grow/shrink the chart.

---

# 23. PAYROLL

Payroll process:

```text
Prepare
Review
Approve
Process
```

As user scrolls:

step 1 activates.

Then:

step 2.

Then:

step 3.

Then:

step 4.

Each active state gets:

* colored icon
* subtle scale
* checkmark
* connecting line

Finally:

```text
Payroll Processed ✓
```

appears.

This is a progress animation, not an arbitrary animation.

---

# 24. DOCUMENTS

Document stack:

```text
Employment Contract
Payslip
Policy
Certificate
```

On scroll:

cards move from overlapping stack:

```text
████
 ████
  ████
```

to:

```text
████  ████  ████  ████
```

Then settle.

Hover individual document:

```text
translateY(-8px)
rotate(1deg)
shadow increase
```

Filter tabs actually work.

---

# 25. CONNECTED WORKFLOW

This should be one of the signature Achare animations.

Display:

```text
Candidate
   ↓
Interview
   ↓
Hired
   ↓
Employee
   ↓
Time
   ↓
Payroll
   ↓
Documents
```

Create a moving progress indicator.

As user scrolls:

the line draws.

A small profile/avatar travels along the path.

At each stage:

node activates.

Example:

```text
Candidate ●
          ↓
Interview ●
          ↓
Hired     ●
```

The active node gets:

```text
scale 1.1
soft ring
```

This tells the Achare story visually.

---

# 26. WORKSPACE BUILDER

This should be highly interactive.

Feature cards:

```text
CRM
Recruitment
Jobs
Employees
Time
Payroll
Documents
```

Hover:

card lifts.

Click:

card becomes active.

Animation:

```text
border
icon
background
checkmark
```

At the same time:

workspace preview updates.

Example:

Select Payroll.

Preview adds:

```text
Payroll
```

with:

```text
opacity: 0
scale: .96
```

to:

```text
opacity: 1
scale: 1
```

This is one of the most important interactive sections.

---

# 27. PRICING ANIMATION

Monthly / Yearly toggle.

When changed:

price should not simply change.

Animate:

```text
old price:
opacity 1
y 0

→
opacity 0
y -8

new price:
opacity 0
y 8

→
opacity 1
y 0
```

Savings badge appears:

```text
Save 20%
```

with a small scale animation.

Feature lists should remain stable.

Avoid excessive card movement.

---

# 28. TESTIMONIAL CAROUSEL

Use horizontal transition.

Current card:

```text
x: 0
opacity: 1
```

Next:

```text
x: 40px
opacity: 0
```

Transition:

450ms.

Controls:

previous
next

Dots:

active dot expands slightly.

Autoplay:

6–8 seconds.

Pause on hover.

Pause when tab is hidden.

Support touch swipe.

---

# 29. FAQ

Accordion.

Closed:

```text
height: 0
opacity: 0
```

Open:

```text
height: auto
opacity: 1
```

Plus:

```text
+
```

rotates:

```text
45deg
```

becoming an X.

Duration:

300ms.

Do not use abrupt height changes.

---

# 30. BLOG CARDS

On hover:

image:

```text
scale(1.03)
```

Card:

```text
translateY(-4px)
```

Arrow:

```text
translateX(5px)
```

Category:

subtle color transition.

All happen together.

Duration:

250ms.

---

# 31. IMAGE MOTION

Do not use aggressive image zooming.

Use:

```text
scale(1.01 → 1.03)
```

during hover.

For editorial photographs:

background geometric shape can move 4–10px.

Image remains grounded.

---

# 32. GEOMETRIC SHAPE MOTION

Decorative shapes can have very slow motion.

Circle:

```text
translateY(-8px)
```

Duration:

7s.

Triangle:

```text
rotate(2deg)
```

Duration:

9s.

Dots:

subtle opacity:

```text
.4 → .7 → .4
```

Duration:

4s.

These loops must be extremely subtle.

---

# 33. MARQUEE

For integrations / trust logos:

horizontal movement.

Speed:

very slow.

Approximately:

```text
40–60px/sec
```

Pause on hover.

Use duplicated content for seamless looping.

Do not use for critical content.

---

# 34. PAGE TRANSITIONS

If using multiple pages:

Page exit:

```text
opacity 1
→ .95
```

New page:

```text
opacity 0
translateY(8px)
```

to:

```text
opacity 1
translateY(0)
```

Duration:

300–450ms.

Avoid cinematic page transitions that slow navigation.

---

# 35. LOADING STATES

Every live UI component needs a believable loading state.

Example dashboard:

Skeleton:

```text
████████
████
████████████
```

Use animated shimmer.

Shimmer:

left → right

Duration:

1.4s

But:

Do NOT show fake loading on initial marketing page.

Loading states are for:

* demo
* dynamic content
* blog
* pricing
* workspace preview
* actual app data

---

# 36. BUTTON LOADING STATE

When submitting:

Normal:

```text
Book a Demo →
```

Loading:

```text
● ● ●
```

or spinner.

Then:

```text
Request Sent ✓
```

Transition after successful submission.

Never leave users wondering whether their action worked.

---

# 37. FORM INTERACTIONS

Input:

default:
thin border.

Hover:
border darkens.

Focus:

```text
border: blue
box-shadow:
0 0 0 3px rgba(65,105,245,.12)
```

Label should remain stable.

Do not use overly complicated floating-label animations.

Validation:

Success:

green check.

Error:

red indicator + concise message.

Do not shake the entire form.

---

# 38. TOOLTIPS

Tooltip:

```text
opacity: 0
translateY(4px)
```

to:

```text
opacity: 1
translateY(0)
```

Delay:

300ms.

Use only where the UI needs explanation.

---

# 39. SCROLL BEHAVIOR

Use smooth scrolling.

But do not hijack scroll.

Normal wheel behavior must remain natural.

Scroll-driven animations should be progress based.

Do not force visitors through cinematic sequences.

---

# 40. STICKY SECTIONS

Use sticky storytelling for selected areas.

Example:

Left side stays fixed:

```text
Turn hiring into
a growth engine.
```

Right side changes:

```text
Pipeline
Candidate
Interview
Offer
Hired
```

As visitor scrolls:

the visual changes.

This creates a sophisticated editorial experience.

Use this for:

Recruitment
Connected workflow
Workspace builder

Do not use sticky sections everywhere.

---

# 41. HOVER PHILOSOPHY

Every interactive object should give immediate feedback.

But feedback must be subtle.

Use:

```text
+ slight movement
+ slight shadow
+ slight color shift
+ icon movement
```

Avoid:

```text
large scale
rotation
glow
explosion
```

The site should feel expensive.

Expensive interfaces whisper.

---

# 42. ICON SYSTEM

Use one icon system.

Recommended:

Lucide.

Stroke:

1.5–2px.

Feature icons can have:

small colored circular background.

On hover:

icon:

```text
scale(1.05)
```

and background slightly changes.

Do not mix 3D icons, emoji and line icons randomly.

---

# 43. MICROINTERACTION INVENTORY

Implement these reusable interactions:

BUTTON_HOVER

BUTTON_PRESS

BUTTON_LOADING

BUTTON_SUCCESS

LINK_ARROW

ICON_HOVER

CARD_LIFT

CARD_FOCUS

INPUT_FOCUS

INPUT_SUCCESS

INPUT_ERROR

DROPDOWN_OPEN

DROPDOWN_CLOSE

MOBILE_MENU_OPEN

MOBILE_MENU_CLOSE

TAB_SWITCH

TOGGLE_SWITCH

ACCORDION_OPEN

ACCORDION_CLOSE

CAROUSEL_NEXT

CAROUSEL_PREVIOUS

TOOLTIP_OPEN

TOOLTIP_CLOSE

SCROLL_REVEAL

COUNTER_START

CHART_DRAW

PROGRESS_STEP

DOCUMENT_STACK

CANDIDATE_MOVE

WORKSPACE_ADD_MODULE

WORKSPACE_REMOVE_MODULE

PAGE_ENTER

PAGE_EXIT

LOADING_SKELETON

NOTIFICATION_APPEAR

NOTIFICATION_DISMISS

````

Build these as reusable primitives rather than writing one-off animations everywhere.

---

# 44. REDUCED MOTION

Mandatory.

If:

```css
prefers-reduced-motion: reduce
````

then:

Disable:

* parallax
* cursor movement
* infinite floating
* auto-moving carousels
* complex scroll choreography

Replace with:

```text
opacity
simple transform
instant state transitions
```

Users should still receive the complete information.

---

# 45. MOBILE MOTION

Do not simply copy desktop animation.

Mobile:

Remove cursor effects.

Reduce parallax.

Reduce floating.

Reduce simultaneous animations.

Keep:

* scroll reveal
* card interactions
* charts
* counters
* tabs
* accordion
* workspace selector

Mobile should feel fast.

---

# 46. PERFORMANCE RULES

Never animate:

```text
top
left
width
height
margin
padding
```

unless unavoidable.

Prefer:

```text
transform
opacity
clip-path
```

Use GPU-friendly transforms.

Avoid excessive:

```text
filter: blur()
backdrop-filter
```

Do not run hundreds of animation loops.

Pause offscreen animations.

Use IntersectionObserver.

Lazy-load below-the-fold images.

Respect visibility.

---

# 47. Z-INDEX SYSTEM

Create a controlled z-index scale.

```text
base: 0

decorations: 1

content: 10

floating UI: 20

sticky elements: 30

navbar: 40

dropdown: 50

modal: 100

toast: 200
```

Do not use random z-index values.

---

# 48. COMPONENT MOTION API

Create reusable motion components.

Example conceptual API:

```tsx
<Reveal>
  ...
</Reveal>

<Floating>
  ...
</Floating>

<Stagger>
  ...
</Stagger>

<AnimatedCounter
  from={0}
  to={18}
/>

<DrawArrow />

<ProgressStep />

<AnimatedChart />

<FeatureCard />

<InteractiveDashboard />

<WorkspaceBuilder />
```

Motion should be controlled through reusable components.

---

# 49. ANIMATION DEBUG MODE

Create an optional development flag:

```text
NEXT_PUBLIC_DEBUG_MOTION=true
```

When enabled:

show:

* animation names
* duration
* trigger
* current state

This makes future maintenance easier.

Remove visual debug information in production.

---

# 50. DESIGN SYSTEM DOCUMENTATION

Create:

```text
/design-system
```

or an internal style-guide route.

Document:

Colors
Typography
Spacing
Buttons
Cards
Forms
Icons
Animations
Motion tokens
Feature colors
Breakpoints
Shadows
Borders
Loading states
Interaction states

Every component should have:

Default
Hover
Active
Focus
Disabled
Loading
Success
Error

where applicable.

============================================================
51. ACHARE SIGNATURE MOTION
===========================

Create three signature interactions unique to Achare.

SIGNATURE #1:

"One person. One record. One timeline."

A person profile travels through:

CRM
→
Recruitment
→
Employee
→
Time
→
Payroll
→
Documents

The profile remains visually connected throughout.

SIGNATURE #2:

"Work moves forward."

Candidate card progresses:

New
→
Screening
→
Interview
→
Offer
→
Hired

This visually communicates movement.

SIGNATURE #3:

"Build your workspace."

Visitor selects modules.

The Achare workspace dynamically builds itself.

This should become the most interactive conversion component on the site.

============================================================
52. OVERALL MOTION RHYTHM
=========================

The page should alternate between:

STATIC
↓
SUBTLE MOTION
↓
INTERACTION
↓
STATIC
↓
PRODUCT DEMONSTRATION
↓
STATIC
↓
INTERACTION

Do NOT make every section move.

Stillness makes motion meaningful.

============================================================
53. FINAL ART DIRECTION
=======================

The final result should feel like:

A sophisticated SaaS product website
with editorial art direction
and product-level interaction design.

Not:

A template.

Not:

An AI-generated landing page.

Not:

A WebGL experiment.

Not:

A collection of animated cards.

The visitor should feel that Achare is a real,
mature software company with a carefully designed product.

The visual hierarchy should always be:

1. Message
2. Product
3. Interaction
4. Decoration

Never:

Decoration
Animation
Gradient
Product
Message

============================================================
54. FINAL ACCEPTANCE CRITERIA
=============================

Before shipping, verify:

[ ] Hero loads quickly
[ ] Hero has controlled motion
[ ] Navigation transitions correctly
[ ] Buttons have hover/press/loading states
[ ] Recruitment UI actually animates
[ ] Jobs UI actually animates
[ ] Employee tabs work
[ ] Time chart animates
[ ] Payroll progress animates
[ ] Documents interact
[ ] Connected workflow animates
[ ] Workspace builder is interactive
[ ] Pricing toggle works
[ ] Testimonial carousel works
[ ] FAQ works
[ ] Blog cards have hover states
[ ] Forms have loading/success/error states
[ ] Mobile navigation works
[ ] Mobile animations are reduced
[ ] Reduced motion works
[ ] No horizontal overflow
[ ] No layout shift
[ ] No console errors
[ ] No unnecessary animation loops
[ ] No fake loading delays
[ ] No dead buttons
[ ] No placeholder links
[ ] Performance remains high

```

### The most important takeaway

The Catalyze reference is useful precisely because **it doesn't scream "look at my animations."** Its motion supports the business story. The original case study explicitly describes the approach as using relatively restrained animation, with hover effects around charts, graphs and financial growth, plus animated icons and clean visual structure. :contentReference[oaicite:2]{index=2}

For Achare, I'd push that one step further:

**Catalyze's visual data → Achare's operational data.**

So instead of decorative animation:

> Candidate moves → **hiring is progressing**

> Employee profile changes → **one record contains the whole employee journey**

> Time chart grows → **work is being tracked**

> Payroll steps complete → **work becomes payroll**

> Documents stack → **everything is organized**

> Workspace modules appear → **Achare adapts to the business**

That gives the website a coherent motion language rather than a bag of animation tricks.

And technically, this maps very naturally to modern Webflow/GSAP-style interaction architecture. Webflow's own motion guidance distinguishes simple CSS transitions, CSS keyframe animations, and JavaScript/GSAP interactions for more complex scroll-driven sequences and 3D transforms. :contentReference[oaicite:3]{index=3}

:contentReference[oaicite:4]{index=4}  
:contentReference[oaicite:5]{index=5}
```

[1]: https://webflow.com/made-in-webflow/website/catalyzeai?utm_source=chatgpt.com "Catalyze AI - SaaS website - Webflow"
[2]: https://www.halo-lab.com/projects/catalyze/?utm_source=chatgpt.com "Catalyze — Brand Makeover for AI Business Analytics Platform | Halo Lab"
