# NewsDesk (news.js)

by Craig Hendricks  
codefenix@conchaos.synchro.net  
 telnet://conchaos.synchro.net  
  https://conchaos.synchro.net  



## Description:

A simple RSS feed viewer for Synchronet BBS, which lets users read the
article text in the BBS terminal.

![screen1](https://github.com/codefenix-ConChaos/NewsDesk/assets/12660452/5c21da22-d212-4c98-a41b-497dc5a8275c)


## How it works:

It makes use of Synchronet's rss-atom.js library to access RSS feeds.

![screen2](https://github.com/codefenix-ConChaos/NewsDesk/assets/12660452/59527249-501c-4eee-bc8f-b112bfe96e76)

![screen3](https://github.com/codefenix-ConChaos/NewsDesk/assets/12660452/903809b1-310c-4a01-a63a-f34c71756b90)


When a user selects an article to view, they can optionally be given the 
choice to read the text from the article, provided by a text-rendition of
the article from FrogFind.com.

![screen4](https://github.com/codefenix-ConChaos/NewsDesk/assets/12660452/d860a7ad-d3be-4183-ae2c-fc8ad5189cce)


## Instructions:

 1. Extract the contents of the ZIP file to /sbbs/mods/
 
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

The file must be valid JSON. This means CTRL-A characters must be expressed as 
`\u0001`.

The `icon` should correspond to a .msg file in the `newsicons` directory.

Setting `frog_prompt` to true will prompt the user to view the full article
text. Set this to false if there's enough info given in the RSS feed itself, 
or if the results from FrogFind aren't readable.



## Other Notes



There's no way to know whether FrogFind.com is here to stay, or will always
be free. If it ever changes or ceases to exist, this mod would no longer be
able to fetch text-renditions of articles.

