load("sbbsdefs.js");
load("rss-atom.js");
load("http.js");
load("frame.js");
require("html2asc.js", 'html2asc');

const SHOW_AT_MOST = 10;
const FROG_FIND_URL = "http://www.frogfind.com/read.php?a=";
const MENU_ITEM_FMT = "\x01c\x01h%2d\x01k\x01h)\x01n %s\x010\x01n";
const PROMPT_FMT = "\x01n\r\nSelect: \x01h1\x01n-\x01h%d\x01n or \x01hQ\x01n to quit\x01h> ";
const DIVIDER = "\x01n\x01b______________________________________________________________________________\x01n";
const BW_TEXT = true;

var articleCount = 0;
var articleSelect = 0;
var s = 0;
var l = 0;
var consoleXY;
var rss;
var selection = "";
var jsonSources = "";
var fSources = new File(system.mods_dir + "news_src.json");
if (fSources.open("r")) {
    jsonSources = JSON.parse(fSources.read());
    fSources.close();
    while (bbs.online && selection !== "Q") {
        console.clear();
        console.printfile(system.mods_dir + "news.msg", P_NOABORT);
        s = 0;
        l = 0;
        while (s < Object.keys(jsonSources).length) {
            if (s + 1 < Object.keys(jsonSources).length) {
                console.gotoxy(2, 10 + l);
                printf(MENU_ITEM_FMT, s + 1, jsonSources[s].name);
                s = s + 1;
                console.gotoxy(41, 10 + l);
                printf(MENU_ITEM_FMT, s + 1, jsonSources[s].name);
                s = s + 1;
            } else {
                console.gotoxy(2, 10 + l);
                printf(MENU_ITEM_FMT, s + 1, jsonSources[s].name);
                s = s + 1;
            }
            l = l + 1;
        }
        printf("\r\n" + PROMPT_FMT, Object.keys(jsonSources).length);
        selection = console.getkeys("Q", Object.keys(jsonSources).length, K_UPPER);
        if (selection === "" || selection === undefined) {
            selection = "Q";
        }
        if (!isNaN(selection) && selection !== "") {
            articleSelect = "";
            selection = parseInt(selection) - 1;
            printf("\x01L\x01nGetting feed for \x01h%s\x01n...", jsonSources[selection].name);
            log(LOG_INFO, "Getting feed for " + jsonSources[selection].name);
            try {
                rss = new Feed(jsonSources[selection].url);
            } catch (f_err) {
                print("\x01n\r\n\r\nCouldn't get any data from " + jsonSources[selection].name + "\x01n, \x01hsorry!.\x01n");
                log(LOG_WARNING, f_err + " ... " + jsonSources[selection].name + " (url: " + jsonSources[selection].url + ")");
                continue;
            }
            for (var c = 0; c < rss.channels.length && c <= SHOW_AT_MOST; c++) { // It's normal to have at most one channel in a feed.
                while (bbs.online && articleSelect !== "Q") {
                    articleSelect = "";
                    console.clear();
                    if (file_exists(backslash(system.mods_dir + "newsicons") + jsonSources[selection].icon + ".msg")) {
                        console.printfile(backslash(system.mods_dir + "newsicons") + jsonSources[selection].icon + ".msg", P_NOABORT);
                    }
                    consoleXY = console.getxy();
                    console.gotoxy(30, 1);
                    printf("\x01y\x01h%*s", 50, rss.channels[c].title.slice(0, 50).trim());
                    console.gotoxy(30, 2);
                    printf("\x01w\x01h%*s", 50, "updated " + new Date(rss.channels[c].updated === "" ? rss.channels[c].items[0].date : rss.channels[c].updated).toLocaleString());

                    var frame = new Frame(31, 3, 49, 3, BG_BLACK);
                    frame.open();
                    frame.putmsg("\x01k\x01h" + lfexpand(word_wrap(utf8_decode(rss.channels[c].description.trim()), 49, 49, true, true)).trim());
                    frame.cycle();

                    console.gotoxy(1, consoleXY.y);
                    print("\x01n\r\n" + format("\x01c%2s\x01k\x01h)\x01n \x01w%-58s\x01n \x01b%-16s", "#", "title", "added"));
                    print(DIVIDER);
                    articleCount = 0;
                    for (var i = 0; i < rss.channels[c].items.length && i < SHOW_AT_MOST; i++) {
                        print(format("\x01c\x01h%2d\x01k\x01h)\x01n \x01w\x01h%-58.58s\x01n \x01b\x01h%-16.16s", i + 1, utf8_decode(rss.channels[c].items[i].title), new Date(rss.channels[c].items[i].date).toDateString("en-US")));
                        articleCount = articleCount + 1;
                    }
                    printf(PROMPT_FMT, articleCount);
                    articleSelect = console.getkeys("Q", articleCount, K_UPPER);
                    if (articleSelect === "") {
                        articleSelect = "Q";
                    }
                    if (!isNaN(articleSelect) && articleSelect !== "") {
                        console.clear();
                        print("\x01n\x01bTitle:  \x01w\x01h" + word_wrap(utf8_decode(rss.channels[c].items[articleSelect - 1].title), 70, 70, true, true).replace(/\n/g, "\r\n        ").trim());
                        log(LOG_INFO, rss.channels[c].items[articleSelect - 1].title);
                        if (rss.channels[c].items[articleSelect - 1].author != undefined && rss.channels[c].items[articleSelect - 1].author != "") {
                            printf("\x01n\x01bAuthor: \x01w\x01h%s\r\n", html2asc(rss.channels[c].items[articleSelect - 1].author, BW_TEXT).trim());
                        }
                        print("\x01n\x01bDate:   \x01w\x01h" + new Date(rss.channels[c].items[articleSelect - 1].date).toLocaleString());
                        print(DIVIDER);
                        print(lfexpand(word_wrap(utf8_decode(html2asc(rss.channels[c].items[articleSelect - 1].body, BW_TEXT)), 79, 79, true, true)));
                        if (rss.channels[c].items[articleSelect - 1].body === undefined || rss.channels[c].items[articleSelect - 1].body === "") {
                            print(lfexpand(word_wrap(utf8_decode(html2asc(rss.channels[c].items[articleSelect - 1].content, BW_TEXT)).replace(/\[/g, "\x01k\x01h[").replace(/\]/g, "]\x01n"), 79, 79, true, true)));
                        }
                        if (jsonSources[selection].frog_prompt) {
                            if (!console.noyes("Read full article text")) {
                                print("\x01n\x01gGetting text via \x01hFrogFind\x01n\x01g for:\r\n\x01n\x01c" + rss.channels[c].items[articleSelect - 1].link + "\x01n...\r\n");
                                log(LOG_INFO, "Getting text via FrogFind for:" + rss.channels[c].items[articleSelect - 1].link + "...\r\n");
                                try {
                                    var resp = (new HTTPRequest()).Get(FROG_FIND_URL + rss.channels[c].items[articleSelect - 1].link);
                                    print("\x01q\x01l" +  utf8_decode(html2asc(resp, BW_TEXT)).substr(50).replace(/\[/g, "\x01k\x01h[").replace(/\]/g, "]\x01n") );
                                    print("\x01n\x01b\x01h/===END===/");
                                } catch (err) {
                                    print("\x01nFailed... \x01hFrogFind might be temporarily offline.\r\n\x01w\x01hPlease try again later.\x01n");
                                    log(LOG_WARNING, "No response from: " + FROG_FIND_URL + rss.channels[c].items[articleSelect - 1].link);
                                }
                            }
                        } else {
                            print("\x01n\x01b\x01h/===END===/");
                            console.pause();
                        }
                    }
                    frame.close();
                }
            } // end for
        }
    } // end while
}