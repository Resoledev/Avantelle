# Project State & Active Context

## 🎯 Current Focus
We have been working on my company Avantelle, it is a luxury reselling company specialiing in christian louboutin shoes mainly, and less so Saint Laurent Handbags. We're in the UK and everything is preowned.

We had made our website on shopify, we used the dawn theme, made it under "Warm Atelier" and fully customised nearly every element to be "luxury". 

Everything was going smooth, until another AI model i was using (Gemini) used the shopify CLI to push a change (We hadn't done this before) unfortunately, in doing so, instead of uploading one file, it resubmitted my folder and cut out all of the essential files within shopify and all of the pages broke. It is such a mess that we're unable to clean it up, it's upsetting, but that's out task. We're rebuilding the Avantelle website brick by brick.

My directory for everything avantelle is messy, but this isn't an issue for now. Maybe we can clean it up down the line.

For now, the positive is that I have still got within the "Edit Code" section on my shopify theme (The broken one) all, if not nearly all of the custom files i need. So our task is to rebuild the site using those.

I need to work with you step by step to ensure we do this properly. For example, I need you to tell me where to upload all of our files that are online, not local, to begin rebuilding. I have (not an exact number) but i expect over 50 files to upload, as i said, everything was custom. As an example, in my active tabs on here, i many such as: authentication-luxury.liquid, luxury-footer.liquid. All of these tabs say there's a file missing, but they do exist in my online theme.

In order to make this task as short and simple as possible, i need you to tell me what i need to do to help you. We're going to do this together, please also ensure the tasks you do are not token intensive and if they are let me know first. But yes, i need a task list and for you to ask me any questions you need that i can respond.

Below will be the file i had with Gemini before wrapping it up, this is the one discussing what happened.

The Issue (Gemini)
A shopify theme push command was executed from a local directory (
/Avantelle/theme
) that was incomplete. It was missing standard Shopify Dawn theme assets (JavaScript and CSS files) and the homepage template (
index.json
).

Because the local folder was treated as the "source of truth," Shopify deleted the "missing" files from the live theme during the push, breaking the site layout and removing the homepage.

Symptoms
Homepage returns 404.
Site styling is broken (missing base.css).
Functionality is broken (missing global.js, constants.js, etc.).
"Revert to older version" in Shopify Admin failed because the files were physically deleted, not just changed.
