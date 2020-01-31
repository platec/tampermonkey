// ==UserScript==
// @name         bilibili截图
// @namespace    platec
// @version      0.0.1
// @description  bilibili截图
// @author       platec
// @include      https://www.bilibili.com/video/av*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-idle
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// ==/UserScript==

(function() {
	'use strict';
    var $ = $ || window.$;
    var style = `
    #platec_download {
      position: fixed;
      bottom: 30px;
      left: 0px;
      width: 20px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background-color: #00a1d6;
      cursor: pointer;
      z-index: 999999;
    }
    #platec_download img {
      width: 18px;
      display: inline-block;
      vertical-align: middle;
    }
    `;
    $('body').prepend(`<style>${style}</style>`);
    var $button = $('<div id="platec_download"><img src="data:image/png;base64,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"></img></div>');
    $('body').append($button);

    $button.on('click', download);

    function download() {
      var $video = $('.bilibili-player-video video');
      var width = parseInt($video.width());
      var height = parseInt($video.height());
      var video = $video[0];

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);

      var image = canvas.toDataURL('image/png');
      var title = document.querySelector('#viewbox_report > h1').title;

      var a = document.createElement('a');
      a.download = title;
      a.href = image;
      a.click();
    }
})();