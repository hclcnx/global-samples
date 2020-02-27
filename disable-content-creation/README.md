# Connections Cloud - Disable Content Creation Customization
This example is provided as-is and can be used to hide the UI artifacts, such as buttons and links, that users would use to create new content when accessing Connections Cloud with a web browser.

**NOTES:** 
1. This has no effect on access via desktop plugins, mobile applications or other API-based interactions and should be seen as a way to **limit** new content creation but **not prevent it** entirely.

2. This does not affect SmartCloud Notes (email / calendar) services.

## Enabling the Customization Extension
The files that enable the hiding of the elements are made available and are directly referencable from the public git repository [ibmcnxdev
/
global-samples](https://github.com/ibmcnxdev/global-samples) in the [disable-content-creation](https://github.com/ibmcnxdev/global-samples/tree/master/disable-content-creation) directory.

As an administrator of the organization, do the following:

1. Log into the Connections Cloud organization and then select the *Manage Organization* option from the *Admin* navigation bar menu. .

2. Click on the *Organization Extensions* link in the left-hand navigation tree.

3. At the top of the page, click the *new Apps Manager* link.

4. Click the *New App* button and then select the *Code Editor* option.

5. Remove the example JSON outline that is present by default and then copy/paste the JSON from the [disable-icc-extension.json](https://github.com/ibmcnxdev/global-samples/tree/master/disable-content-creation/disable-icc-extension.json) file.

6. (OPTIONAL) To apply the extension to a subset of users add a *match* rule to the payload section and within it list the email addresses of the users who will be affected by the extension. This can be used in combination with a test account to check the behaviour before enabling for all users. See examples below.

7. (OPTIONAL) To explicitly prevent the extension from affecting a subset of users add an *exclude* rule to the payload section and within it list the email addresses of the users who will not be affected by the extension. See examples below.

8. (OPTIONAL) If you did use a *match* or *exclude* rule for testing the extension but are ready to enable for all users in the organization, simply remove the *match* and / or *exclude* elements from the JSON.

**TIP:** Consider leaving administrator accounts excluded from the extension.

## Additional Payload Examples
### Extension Applies to Only Specified Users
```
"payload": {
    "include-files": [
        "disable-content-creation/disable-icc-content-creation.js"
    ],
    "include-repo":{
        "name": "global-samples"
    },
    "cache-headers": {
        "cache-control": "max-age=43200"
    },
    "match": {
        "user-email": [
            "include1@domain.com",
            "include2@domain.com"
        ]
    }
}
```
  
### Extension Does Not Apply to Specified Users
```
"payload": {
    "include-files": [
        "disable-content-creation/disable-icc-content-creation.js"
    ],
    "include-repo":{
        "name": "global-samples"
    },
    "cache-headers": {
        "cache-control": "max-age=43200"
    },
    "exclude": {
        "user-email": [
            "exclude1@domain.com",
            "exclude2@domain.com"
        ]
    }
}
  
```
## Validating the Extension is Loaded
Use the following procedure:

1. Open the browser development tools panel.

2. Select the **Network** trace tab, filter the request types to only show JS content.

3. Log in and load pages with an account that should be affected by the extension.

4. In the request trace, you should see the request for the */files/customizer/global-samples/disable-content-creation/disable-icc-content-creation.js* and a *200* response code.

5. There is a very obvious banner across the top of the page that states "THIS ORG IS IN READ-ONLY MODE".

6. Buttons and links that are typically present to create content should not be visible.
