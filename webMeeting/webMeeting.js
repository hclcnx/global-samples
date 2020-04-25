
/*
 * © Copyright HCL Corp. 2020
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */
//
//  *********************************************************************
//  *                                                                   *
//  * ADMINISTRATOR:                                                    *
//  *   You need to set the variable   electedAttribute                 *
//  *   This variable may have the following values:                    *
//  *       - LINKROLL (default)                                        *
//  *         In this case the script looks for a link named 'Meeting'  *
//  *         (spelled exactly as written) in which each user will      *
//  *         add the URL of the meeting service of his choice          *
//  *       - <a profile attribute-name>                                *
//  *         (for instance, x-groupwareMail for the "Alternate Mail")  *
//  *         Users will have to insert the link to their preferred     *
//  *         meeting service by modifying that attribute in their      *
//  *         HCL Connections Profile                                   *
//  *                                                                   *
//  *********************************************************************
//
var electedAttribute = 'LINKROLL';
if (document.location.pathname.startsWith('/connections/opensocial/') || document.location.pathname.startsWith('/connections/resources/') || document.location.pathname.startsWith('/touchpoint')) {
    __cBill_logger('cnxMeetingInjector : ******************* ignoring ' + document.location.pathname + ' **********************');
} else {
    __cBill_logger('cnxMeetingInjector : $$$$$$$$$$$$$$$$$$$ treating ' + document.location.pathname + ' $$$$$$$$$$$$$$$$$$$$$$');
    var __dojoIsReady = new __cBill_waitForDojo('webMeeting');
    //
    //  Since this script is applied to GLOBAL, there are some pages (mycontacts, mynetwork) which load Dojo very lazily.
    //  So we need to wait until Dojo is fully loaded before testing and using it
    //
    __dojoIsReady.do(function () {
        try {
            let showMeetingICON = function(theMeeting) {
                if (theMeeting !== null) {
                    //
                    //  Build the new visual item
                    //
                    let __cloche = new __cBill_waitById('checkNotification');
                    __cloche.do(function (theCloche) {
                        //
                        //  Found the Notifications
                        //
                        let newLI = dojo.create('li');
                        dojo.setAttr(newLI, 'id', 'lotusBannerMeeting');
                        let newA = dojo.create('a');
                        dojo.setAttr(newA, 'role', 'button');
                        dojo.setAttr(newA, 'innerHTML', '<img src="/files/customizer/webMeetings/webMeeting.png"></img>');
                        //dojo.addClass(newA, 'lotusBannerBtn');
                        dojo.setStyle(newA, "padding-bottom", "7px");
                        newA.addEventListener('click', function() {
                            dojo.stopEvent(event);
                            let win = window.open(theMeeting, '_blank');
                            win.focus();
                        });
                        //
                        //  then, add the newly created label and HIDE the DIV containg the checkbox
                        //
                        dojo.place(newA, newLI, "first");
                        dojo.place(newLI, "lotusBannerNotifications", "after");
                    }, 'lotusBannerNotifications');
                } else {
                    //
                    //  Do not do Anything
                    //
                }
            }
            //
            // Start of Processing
            //
            __cBill_logger('cnxMeetingInjector : Dojo is defined, injection STARTS NOW !');
            //
            //  First thing. GET THE PROFILE of the current user
            //  Variable "lconn.core.auth.getUser().id" is available from Connections
            //
            try {
                let __userId = lconn.core.auth.getUser().id;
                __cBill_logger('cnxMeetingInjector : Getting profile data for userId: ' + __userId);
                let profilesArgs = {
                    url: "/profiles/json/profile.do",
                    handleAs: "json",
                    preventCache: true,
                    content: { userid: __userId }
                };
                let deferred = dojo.xhrGet(profilesArgs);
                deferred.then(function(data) {
                    __cBill_logger('cnxMeetingInjector : Got profile data');
                    if (data !== null) {
                        //
                        //  The REST Call returned succesfully
                        //  Get the HCARD for the user in XML format
                        //
                        /*dojo.require("dojox.atom.io.model");
                        let feed = new dojox.atom.io.model.Feed();
                        let parser = new DOMParser();
                        feed.buildFromDom(data.documentElement);
                        let hcardXML = parser.parseFromString(feed.entries[0].content.value, "text/html");
                        */
                        let theMeeting = null;
                        if (electedAttribute !== 'LINKROLL') {
                            //
                            //  If the electedAttribute is NOT LINKROLL, fetch the value associated to the elected attribute
                            //
                            // let results = document.evaluate("//div[@class='" + electedAttribute + "']", hcardXML.documentElement, null, XPathResult.ANY_TYPE, null );
                            // let theNode = results.iterateNext();
                            __cBill_logger('cnxMeetingInjector : Looking for meeting url in ' + electedAttribute);
                            theMeeting = data[electedAttribute];
                            if (theMeeting !== null) {
                                __cBill_logger('cnxMeetingInjector : Found ' + electedAttribute + ' Meeting Link : ' + theMeeting);
                                showMeetingICON(theMeeting);
                            } else {
                                //
                                //  Probably the Profile attribute is misspelled
                                //
                                __cBill_logger('cnxMeetingInjector : electedAttribute ' + electedAttribute + ' was not found !');
                            }
                        } else {
                            //
                            //  Linkroll case.
                            //  We need first to fetch the KEY 
                            //
                            let theKey = data.key;
                            if (theKey !== null) {
                                //
                                //  Now we got and fetch the Linkroll
                                //
                                profilesArgs = {
                                    url: "/profiles/atom/profileExtension.do",
                                    handleAs: "xml",
                                    preventCache: true,
                                    content: { key: theKey,  extensionId: 'profileLinks'}
                                };
                                let deferred2 = dojo.xhrGet(profilesArgs);
                                deferred2.then(function(data) {
                                    if (data !== null) {
                                        //
                                        //  There is a LINKROLL.
                                        //  Check if there is a LINK whose name is "Meeting"
                                        //
                                        __cBill_logger('cnxMeetingInjector : Processing extension data list');
                                        for (let i=0; i < data.documentElement.children.length; i++) {
                                            let theChild = data.documentElement.children[i];
                                            let theNameAttribute = theChild.attributes[0];
                                            let theURLAttribute = theChild.attributes[1];
                                            if (theNameAttribute.value === 'Meeting') {
                                                theMeeting = theURLAttribute.value;
                                                __cBill_logger('cnxMeetingInjector : Found LINKROLL Meeting Link : ' + theMeeting);
                                                showMeetingICON(theMeeting);
                                            }
                                        }
                                    } else {
                                        //
                                        //  No LINKROLL
                                        //
                                        __cBill_logger('cnxMeetingInjector : NO LINKROLL !');
                                    }
                                },
                                function(error) {
                                    //
                                    //  deferred2 ERROR
                                    //
                                    __cBill_logger('cnxMeetingInjector : error during getLINKROLL REST API');
                                    console.dir(error);
                                });
                            } else {
                                //
                                //  VERY VERY STRANGE... there is NO KEY ....
                                //
                                __cBill_logger('cnxMeetingInjector : profile KEY was not found !');
                            }
                        }
                    } else {
                        //
                        //  No Response from getProfile API
                        //
                        __cBill_logger('cnxMeetingInjector : NULL response from getPROFILE API !');
                    }   
                },
                function(error) {
                    //
                    //  deferred ERROR
                    //
                    __cBill_logger('cnxMeetingInjector : error during getPROFILE REST API');
                    console.dir(error);
                });
             } catch (ex) {
                __cBill_logger("cnxMeetingInjector error: IMPOSSIBLE TO GET UserId using lconn.core.auth.getUser().id : " + ex);
            }
           } catch (ex) {
            __cBill_logger("cnxMeetingInjector error: MAIN: " + ex);
        }
    });
}