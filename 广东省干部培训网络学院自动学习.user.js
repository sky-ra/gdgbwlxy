// ==UserScript==
// @name         广东省干部培训网络学院自动学习
// @namespace    http://tampermonkey.net/guangdong-study
// @version      0.1.0
// @description  本脚本不支持倍速播放，仅支持自动播放下一课，在原脚本基础上修正了不能自动播放下一课的问题，按下F12打开浏览器控制台可看到脚本运行状态以及当前学习课程
// @author       Nyeming
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @match        https://gbpx.gd.gov.cn/*
// @match        https://wcs1.shawcoder.xyz/*
// @match        https://cs1.gdgbpx.com/*
// @run-at       document-end
// ==/UserScript==

// 原脚本镜像站链接: https://gf.qytechs.cn/zh-CN/scripts/547196-%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE

(function() {
    'use strict';

    GM_setValue("bofangwan", false);
    
    const href = window.location.href;

    // 课程列表页面 - 自动点击第一个课程
    if (href.indexOf("gbpx.gd.gov.cn/gdceportal/Study/LearningCourse.aspx") != -1) {
        const alla = document.querySelectorAll("a.courseware-list-reed");
        if (alla.length > 0) {
            document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin",
                "<div id='buxiangdiv' style='position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);border: 2px solid #555;font-size: 16px;text-align: center;padding: 25px 35px;border-radius: 12px;box-shadow: 0 8px 32px rgba(0,0,0,0.3);z-index: 99999;color:white;'>" +
                "<div>🎓 不想自动弹出刷课视频请在3秒内点击下方按钮</div>" +
                "<button onclick='document.title=605;' style='background:#fff;color:#667eea;font-size:16px;padding:10px 20px;border-radius:8px;border:2px solid #f44336;cursor:pointer;font-weight:bold;margin-top:15px;'>停止自动打开</button>" +
                "</div>"
            );

            setTimeout(function() {
                if (document.title != 605) {
                    document.getElementById("buxiangdiv").innerHTML = "<div>已自动打开视频，如果手动关闭视频可刷新此页恢复自动</div>";
                    
                    const courseLink = alla[0];
                    let courseName = '未知课程';
                    
                    const parentTr = courseLink.closest('tr');
                    if (parentTr) {
                        const cells = parentTr.querySelectorAll('td');
                        if (cells.length > 0) {
                            courseName = cells[0].textContent.trim() || cells[0].innerText.trim() || courseName;
                        }
                    }
                    
                    console.log(`[GD-STUDY] 正在学习课程: ${courseName}`);
                    courseLink.click();
                } else {
                    document.getElementById("buxiangdiv").innerHTML = "<div>已经停止自动打开视频，刷新后重置</div>";
                }
            }, 3000);
        }

        // 检测播放完成并刷新页面
        setInterval(function() {
            if (GM_getValue("bofangwan")) {
                console.log("[GD-STUDY] 检测到播放完成，准备刷新页面");
                GM_setValue("bofangwan", false);
                setTimeout(function() {
                    console.log("[GD-STUDY] 刷新页面开始下一个课程");
                    window.location.reload();
                }, 3000);
            }
        }, 3000);
    }

    // 播放页面1 - playmp4_pc.html
    else if (href == "https://wcs1.shawcoder.xyz/gdcecw/play_pc/playmp4_pc.html") {
        console.log("[GD-STUDY] 进入播放页面1");
        
        setTimeout(function() {
            const buttons = document.getElementsByTagName("button");
            if (buttons.length >= 3) {
                buttons[2].click();
                buttons[1].click();
                console.log("[GD-STUDY] 点击播放按钮");
            }
        }, 1000);

        setInterval(function() {
            const progressBar = document.getElementsByClassName("vjs-play-progress vjs-slider-bar")[0];
            if (progressBar && progressBar.style.width == "100%") {
                console.log("[GD-STUDY] 视频播放完成");
                GM_setValue("bofangwan", true);
            } else {
                const buttons = document.getElementsByTagName("button");
                if (buttons.length >= 2 && buttons[1].title != "暂停") {
                    buttons[1].click();
                }
            }
        }, 3000);
    }

    // 播放页面2 - CourseWare/index.htm
    else if (href.indexOf("wcs1.shawcoder.xyz/gdcecw/CourseWare") != -1 && href.endsWith("index.htm")) {
        console.log("[GD-STUDY] 进入播放页面2");
        
        if (document.getElementsByTagName("a")[0].innerText != "退出") {
            document.getElementsByTagName("a")[0].click();
            console.log("[GD-STUDY] 点击进入播放");
        } else {
            setInterval(function() {
                const video = document.getElementsByTagName("video")[0];
                if (video) {
                    video.volume = 0;
                    if (video.currentTime != video.duration) {
                        video.play();
                    } else {
                        console.log("[GD-STUDY] 视频播放完成");
                        GM_setValue("bofangwan", true);
                    }
                }
            }, 2000);
        }
    }

    // 播放页面3 - CourseWare/play.htm
    else if (href.indexOf("wcs1.shawcoder.xyz/gdcecw/CourseWare") != -1 && href.endsWith("play.htm")) {
        console.log("[GD-STUDY] 进入播放页面3");
        
        const jingyin = setInterval(function() {
            const jingyinarr = document.getElementsByTagName("video");
            if (jingyinarr.length > 0) {
                jingyinarr[0].volume = 0;
            }
        }, 50);

        setInterval(function() {
            const videoarr = document.getElementsByTagName("video");
            if (videoarr.length > 0) {
                const video = videoarr[0];
                if (video.volume == 0) {
                    clearInterval(jingyin);
                }
                if (video.currentTime != video.duration) {
                    video.play();
                } else {
                    console.log("[GD-STUDY] 视频播放完成");
                    GM_setValue("bofangwan", true);
                }
            }

            const blockUI = document.getElementsByClassName("blockUI");
            if (blockUI.length > 0) {
                for (let i = 0; i < blockUI.length; i++) {
                    blockUI[i].style.display = "none";
                }
            }
        }, 3000);
    }

    // 播放完成页面 - playdo_pc.html
    else if (href == "https://wcs1.shawcoder.xyz/gdcecw/play_pc/playdo_pc.html") {
        console.log("[GD-STUDY] 进入播放完成页面");
        
        setInterval(function() {
            if (GM_getValue("bofangwan")) {
                console.log("[GD-STUDY] 检测到播放完成，点击关闭按钮");
                const closeBtn = document.querySelectorAll("button.instructions-close")[0];
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        }, 2000);
    }

    // 学习中心页面 - StudyCenter.aspx
    else if (href == "https://gbpx.gd.gov.cn/gdceportal/study/StudyCenter.aspx") {
        console.log("[GD-STUDY] 进入学习中心页面");
        
        setInterval(function() {
            if (GM_getValue("bofangwan")) {
                console.log("[GD-STUDY] 检测到播放完成，准备刷新页面");
                GM_setValue("bofangwan", false);
                setTimeout(function() {
                    console.log("[GD-STUDY] 刷新页面开始下一个课程");
                    window.location.reload();
                }, 3000);
            }
        }, 3000);
    }

})();
