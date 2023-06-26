# NewsDesk (news.js)

by Craig Hendricks  
codefenix@conchaos.synchro.net  
 telnet://conchaos.synchro.net  
  https://conchaos.synchro.net  



## Description:

A simple RSS feed viewer for Synchronet BBS, which lets users read the
article text in the BBS terminal.



## How it works:

It makes use of Synchronet's rss-atom.js library to access RSS feeds.

When a user selects an article to view, they can optionally be given the 
choice to read the text from the article, provided by a text-rendition of
the article from FrogFind.com.
 
 

## Instructions:

 1. Extract the contents of the newsdesk.zip to /sbbs/mods/
 
 2. Add to SCFG -> External Programs-> Online Programs (Doors):
    ```
    Name                  NewsDesk
    Internal Code         news
    Start-up Directory    ../xtrn/mods
    Command Line          ?news.js
    ```
       
       

## Configuration and Customization:

Edit the included .msg file to your liking in PabloDraw.

Obviousy, everyone prefers different news sources. You can add or remove news 
sources in the `news_src.json` file. Each entry should be formatted as follows:

```
{
    "name": "\u0001rBBC News",
    "url": "http://feeds.bbci.co.uk/news/rss.xml",
    "icon": "bbc",
    "frog_prompt": true
},
```

16 different sources come pre-configured. Up to 22 sources fit comfortably.

The file must be valid JSON. This means CTRL-A codes must be expressed as 
`\u0001`.

The `icon` should correspond to a .msg file in the `newsicons` directory.

Setting `frog_prompt` to true will prompt the user to view the full article
text. Set this to false if there's enough info given in the RSS feed itself, 
or if the results from FrogFind aren't readable.



## Other Notes

There's no way to know whether FrogFind.com is here to stay, or will always
be free. If it ever changes or ceases to exist, this mod would no longer be
able to fetch text-renditions of articles.

