Now I'm updating the useEffect hook to set the loaded campaign ID and adding the campaign ID display to the header section.


Edited client/src/pages/content-manager.tsx
Now I'm adding the campaign ID label to the content manager header to display which campaign is currently loaded for editing.


Edited client/src/pages/content-manager.tsx
I'm now updating the saveContentToDatabase function to include the campaign ID from the loaded context data, ensuring proper data association when saving edited content.


Edited client/src/pages/content-manager.tsx
I've successfully added a campaign ID label to the Content Manager that shows which campaign is currently loaded for editing. Here's what I implemented:

Added state tracking for the loaded campaign ID
Enhanced the header display to show "Editing Campaign" when a context is loaded from the context library
Updated the campaign ID display to prioritize the loaded campaign ID over the active campaign
Added visual confirmation with a green checkmark when context data is loaded
Included campaign ID in save operations to ensure proper data association
The campaign label now clearly indicates when you're editing a specific campaign context, showing the campaign ID and a confirmation message that the context data has been loaded. When saving content, it will be properly associated with the correct campaign ID.