// ==UserScript==
// @name        LoungeSpammer
// @namespace   LoungeSpammer
// @author      mreq http://github.com/mreq
// @include     http://csgolounge.com/mybets
// @include     http://dota2lounge.com/mybets
// @include     http://csgolounge.com/match?m=*
// @include     http://dota2lounge.com/match?m=*
// @version     0.1.0
// @downloadURL http://cdn.mreq.eu/LoungeSpammer.user.js
// @updateURL   http://cdn.mreq.eu/LoungeSpammer.user.js
// @grant       none
// ==/UserScript==

var BetSpammer, ReturnsSpammer, Spammer, init,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Spammer = (function() {
  function Spammer() {
    this.overwriteAlert();
    this.addButton();
  }

  Spammer.prototype.createBox = function() {
    this.box = $("<section class=\"box\">\n	<div class=\"title\">Status</div>\n		<article class=\"standard\" style=\"margin-top: 50px; margin-bottom: 0;\" id=\"loungespammer\"></article>\n		<article class=\"standard\" style=\"margin-top: 19px;\"><em>Does this script help you?</em> Be kind and say <a href=\"http://steamcommunity.com/tradeoffer/new/?partner=16222794&token=BOqXsQwB\" target=\"_blank\">thanks to the author</a> &lt;3.</article>\n</section>");
    $('#main > .box').first().after(this.box);
    return this.content = this.box.find('#loungespammer');
  };

  Spammer.prototype.overwriteAlert = function() {
    this.i = 0;
    this.messages = [];
    return window.alert = (function(_this) {
      return function(c) {
        if (_this.messages.indexOf(c) === -1) {
          _this.messages.push(c);
        }
        return _this.content.html("<strong>" + c + "</strong><br><br>\nTried " + _this.i + " times over the last " + (Math.floor((Date.now() - _this.startTime) / 60000)) + " minute(s).<br><br>\nMessages so far:<br>\n<ul style=\"padding-left: 30px;\">\n	<li style=\"padding-top: 5px;\">" + (_this.messages.join('<li style="padding-top: 5px;"></li>')) + "</li>\n</ul>");
      };
    })(this);
  };

  Spammer.prototype.startSpamming = function() {
    this.startTime = Date.now();
    this.createBox();
    this.spamLounge();
    return setInterval(((function(_this) {
      return function() {
        return _this.spamLounge();
      };
    })(this)), 1500);
  };

  Spammer.prototype.addButton = function() {
    return this.spamButton.one('click', (function(_this) {
      return function() {
        return _this.startSpamming();
      };
    })(this));
  };

  Spammer.prototype.spamLounge = function() {
    this.i++;
    return this.button.click();
  };

  return Spammer;

})();

BetSpammer = (function(_super) {
  __extends(BetSpammer, _super);

  function BetSpammer() {
    this.button = $('#placebut');
    BetSpammer.__super__.constructor.apply(this, arguments);
  }

  BetSpammer.prototype.addButton = function() {
    this.spamButton = $('<a class="buttonright" style="margin-left: 5px;" id="loungespammer-button">Spam place bet</a>');
    BetSpammer.__super__.addButton.apply(this, arguments);
    return this.button.before(this.spamButton);
  };

  return BetSpammer;

})(Spammer);

ReturnsSpammer = (function(_super) {
  __extends(ReturnsSpammer, _super);

  function ReturnsSpammer() {
    this.button = $('#freezebutton');
    ReturnsSpammer.__super__.constructor.apply(this, arguments);
  }

  ReturnsSpammer.prototype.addButton = function() {
    this.spamButton = $('<a class="button" style="margin-left: 5px;" id="loungespammer-button">Spam request returns</a>');
    ReturnsSpammer.__super__.addButton.apply(this, arguments);
    return this.button.after(this.spamButton);
  };

  ReturnsSpammer.prototype.startSpamming = function() {
    ReturnsSpammer.__super__.startSpamming.apply(this, arguments);
    return this.spamLounge();
  };

  return ReturnsSpammer;

})(Spammer);

init = function() {
  var url;
  url = window.location.href;
  if (url.match('mybets') !== null) {
    return new ReturnsSpammer;
  } else if (url.match('match') !== null) {
    return new BetSpammer;
  }
};

init();
