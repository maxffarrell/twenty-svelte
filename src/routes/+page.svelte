<script lang="ts">
 import { Button, Input, Label, Textarea, Card } from '$lib';
 import DemoLink from '../demo/DemoLink.svelte';
 const seed = [
  { id: 1, name: 'Thomas Kurian', email: 'thomas@company.com', role: 'Chief executive officer' },
  { id: 2, name: 'Ada Lovelace', email: 'ada@analytical.co', role: 'Mathematician' },
  { id: 3, name: 'Alex Morgan', email: 'alex@studio.co', role: 'Product designer' }
 ];
 let contacts = $state(seed.map(contact => ({ ...contact })));
 let query = $state('');
 let name = $state('');
 let email = $state('');
 let note = $state('');
 let status = $state('Changes stay in this browser tab.');
 let copied = $state(false);
 const filtered = $derived(contacts.filter(contact => `${contact.name} ${contact.role} ${contact.email}`.toLowerCase().includes(query.toLowerCase())));
 const example = `<script lang="ts">\n  import { Button, Input, Label } from 'twenty-svelte';\n<\/script>\n\n<Label for="name">Full name</Label>\n<Input id="name" showPrefix={false} />\n<Button accent="blue" showLeadingIcon={false}>\n  Save contact\n</Button>`;
 function save(event: SubmitEvent) {
  event.preventDefault();
  contacts = [...contacts, { id: Date.now(), name: name.trim(), email: email.trim(), role: note.trim() || 'Add a job title' }];
  status = `Added ${name.trim()}.`;
  name = ''; email = ''; note = ''; query = '';
 }
 function remove(id: number) {
  const contact = contacts.find(item => item.id === id);
  contacts = contacts.filter(item => item.id !== id);
  status = `Removed ${contact?.name}.`;
 }
 async function copy() {
  try { await navigator.clipboard.writeText(example); copied = true; }
  catch { status = 'Clipboard unavailable. Select the example to copy it.'; }
 }
</script>
<svelte:head>
 <title>Twenty Svelte — Component workbench</title>
 <meta name="description" content="Explore Twenty’s Figma components in Svelte. A working contact workspace built with our own buttons, fields, and record cards." />
</svelte:head>
<div class="workbench">
 <a class="skip" href="#content">Skip to content</a>
 <aside class="sidebar">
  <a class="wordmark" href="#overview"><span class="wordmark-symbol">tw</span><span>Twenty <span class="wordmark-secondary">Svelte</span></span></a>
  <div class="sidebar-section"><span class="nav-heading">WORKBENCH</span><nav aria-label="Workbench"><DemoLink href="#overview">Overview</DemoLink><DemoLink href="#workspace">Contact workspace</DemoLink><DemoLink href="#components">Components</DemoLink><DemoLink href="#usage">Use in your project</DemoLink></nav></div>
  <div class="sidebar-section"><span class="nav-heading">RESOURCES</span><nav aria-label="Resources"><DemoLink href="/reference">Figma specimens ↗</DemoLink><DemoLink href="https://www.figma.com/design/zpykphKQ2es7WjtOvymue6/Twenty--Copy-">Design source ↗</DemoLink><DemoLink href="https://github.com/maxffarrell/twenty-svelte">GitHub ↗</DemoLink></nav></div>
  <div class="sidebar-bottom"><span class="system-indicator"></span> System appearance <span class="theme-light-name">· Light</span><span class="theme-dark-name">· Dark</span><p>Independent community port<br/>Open source · MIT licensed</p></div>
 </aside>
 <div class="main-column">
  <header class="toolbar"><span>Library <span class="breadcrumb-divider">/</span> <strong>Overview</strong></span><DemoLink variant="secondary" href="https://github.com/maxffarrell/twenty-svelte">View source ↗</DemoLink></header>
  <main id="content">
   <section class="overview" id="overview"><div class="section-eyebrow">TWENTY DESIGN SYSTEM / SVELTE 5</div><h1>Small components.<br/>A complete working surface.</h1><p>Twenty’s precise, compact controls, ported from Figma to Svelte. This workbench uses the same components you’ll use in your app.</p><div class="overview-actions"><DemoLink variant="primary" href="#workspace">Try the workspace ↓</DemoLink><DemoLink variant="secondary" href="/reference">Inspect Figma specimens ↗</DemoLink></div><div class="spec-strip"><span><strong>05</strong> component types</span><span><strong>180</strong> button specimens</span><span><strong>24 / 32</strong> px controls</span></div></section>
   <section class="section" id="workspace">
    <div class="section-heading"><div><span class="section-eyebrow">01 / IN CONTEXT</span><h2>A little workspace. Real components.</h2><p>Search, add, and remove contacts to see the library at work.</p></div><Button variant="tertiary" showLeadingIcon={false} onclick={() => { contacts = seed.map(contact => ({ ...contact })); query = ''; status = 'Example contacts restored.'; }}>Reset example</Button></div>
    <div class="workspace-surface">
     <div class="workspace-bar"><span>Contacts <span class="count">{contacts.length}</span></span><span class="local-label">Local playground</span></div>
     <div class="workspace-grid">
      <div class="contact-list"><div class="search-field"><Label for="search">Search contacts</Label><Input id="search" type="search" placeholder="Name, email, or job title…" showPrefix={false} bind:value={query}/></div><div class="records">{#each filtered as contact (contact.id)}<Card.Root><Card.Avatar letter={contact.name.charAt(0)} /><Card.Header><Card.Title>{contact.name}</Card.Title><Card.Description>{contact.role}</Card.Description></Card.Header><Card.Action aria-label={`Remove ${contact.name}`} onclick={() => remove(contact.id)} /></Card.Root>{:else}<p class="empty-state">{query ? 'No contacts match your search.' : 'Your next connection starts here. Add a contact.'}</p>{/each}</div><p class="list-caption">{filtered.length} of {contacts.length} contacts</p></div>
      <form class="contact-form" onsubmit={save}><div class="form-heading"><h3>Add a contact</h3><p>Make room for someone new.</p></div><div class="field"><Label for="name">Full name</Label><Input id="name" autocomplete="name" placeholder="e.g. Grace Hopper" showPrefix={false} bind:value={name} required pattern=".*\S.*" /></div><div class="field"><Label for="email">Email address</Label><Input id="email" autocomplete="email" type="email" placeholder="grace@company.com" showPrefix={false} bind:value={email} required /></div><div class="field"><Label for="note">Job title · optional</Label><Textarea id="note" placeholder="What do they do?" bind:value={note}/></div><div class="form-actions"><Button type="submit" accent="blue" showLeadingIcon={false}>Save contact</Button><Button variant="secondary" showLeadingIcon={false} onclick={() => { name = ''; email = ''; note = ''; }}>Clear</Button></div></form>
     </div><div class="workspace-status" role="status">{status}</div>
    </div>
   </section>
   <section class="section" id="components"><div class="section-heading"><div><span class="section-eyebrow">02 / THE BUILDING BLOCKS</span><h2>Precision, down to the state.</h2><p>Source dimensions, typography, borders, icons, and interaction states.</p></div><DemoLink href="/reference">All specimens ↗</DemoLink></div>
    <div class="component-table">{#each ['primary', 'secondary', 'tertiary'] as variant (variant)}<div class="component-row"><div class="component-name"><h3>{variant}</h3><span>24px / 32px</span></div><div class="button-specimens">{#each ['default', 'blue', 'danger'] as accent (accent)}<div class="specimen-pair"><Button variant={variant as 'primary' | 'secondary' | 'tertiary'} accent={accent as 'default' | 'blue' | 'danger'} size="sm">Filter</Button><Button variant={variant as 'primary' | 'secondary' | 'tertiary'} accent={accent as 'default' | 'blue' | 'danger'}>Filter</Button></div>{/each}</div></div>{/each}<div class="component-row"><div class="component-name"><h3>Field states</h3><span>Input / label</span></div><div class="field-specimens"><div class="field"><Label for="small">Small · 24px</Label><Input id="small" controlSize="sm" placeholder="First name" /></div><div class="field"><Label for="invalid">Invalid</Label><Input id="invalid" value="Tim" aria-invalid="true" /></div><div class="field"><Label for="disabled">Disabled</Label><Input id="disabled" value="Tim" disabled /></div></div></div></div>
    <p class="source-note">Light specimens are measured against the Figma source. Dark appearance uses Twenty’s public theme tokens.</p>
   </section>
   <section class="section usage-section" id="usage"><div><span class="section-eyebrow">03 / START BUILDING</span><h2>Bring the system<br/>to your own surface.</h2><p>Import the components and their styles from a local checkout. Keep the familiar details; build your own workflows.</p><DemoLink variant="secondary" href="https://github.com/maxffarrell/twenty-svelte#use-from-a-local-checkout">Read the setup guide ↗</DemoLink></div><div class="code-panel"><div class="code-heading"><span>Contact.svelte</span><Button variant="tertiary" size="sm" showLeadingIcon={false} onclick={copy}>{copied ? 'Copied' : 'Copy code'}</Button></div><pre><code>{example}</code></pre></div></section>
   <footer class="workbench-footer"><span>Twenty Svelte <span class="footer-dot">·</span> Built with its own components.</span><span>Inter · Twenty tokens · Svelte 5</span></footer>
  </main>
 </div>
</div>
