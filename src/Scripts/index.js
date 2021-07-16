import task1 from "./alog"
import task2 from "./alog2"

export default [
    {
        name: "副本周回（剧情，活动通用）",
        script: "" + task2 + "",
        config: {
            ap50: {
                default: false
            },
            ap50Count: {
                default: ""
            },
            apfull: {
                default: false
            },
            apfullCount: {
                default: ""
            },
            apmo: {
                default: false
            },
            apmoCount: {
                default: ""
            },
        },
        introduce: "abbababb",
        helper: "agaddf adsf dffdfsw\ndaf",
    },
    {
        name: "副本周回（备用）",
        script: "" + task2 + "",
        config: {
            justnpc: {
                default: false,
                save: true
            }
        },
        introduce: "wahhhhhh",
        helper: "agaddf adsf dffdfsw\ndaf",
    },
]
