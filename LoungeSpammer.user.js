// ==UserScript==
// @name        LoungeSpammer
// @namespace   LoungeSpammer
// @author      mreq http://github.com/mreq
// @include     http://csgolounge.com/mybets
// @include     http://dota2lounge.com/mybets
// @include     http://csgolounge.com/match
// @include     http://dota2lounge.com/match
// @version     0.0.1
// @downloadURL http://cdn.mreq.eu/LoungeSpammer.user.js
// @updateURL   http://cdn.mreq.eu/LoungeSpammer.user.js
// @grant       none
// ==/UserScript==

(function() {
  var BetSpammer, ReturnsSpammer, Spammer, init,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Spammer = (function() {
    function Spammer() {
      this.createBox();
      this.overwriteAlert();
      this.addButton();
    }

    Spammer.prototype.createBox = function() {
      this.box = $('<section class="box"><div class="title">Status</div><article class="standard" style="margin-top:50px;" id="loungespammer"></article></section>');
      $('#main > .box').first().after(this.box);
      return this.content = this.box.find('#loungespammer');
    };

    Spammer.prototype.overwriteAlert = function() {
      this.i = 0;
      return window.alert = (function(_this) {
        return function(c) {
          return _this.content.text("" + _this.i + ": " + c);
        };
      })(this);
    };

    Spammer.prototype.startSpamming = function() {
      return setInterval(((function(_this) {
        return function() {
          _this.i++;
          return _this.spamLounge();
        };
      })(this)), 1500);
    };

    Spammer.prototype.addButton = function() {
      return this.spamButton.one('click', this.startSpamming);
    };

    Spammer.prototype.spamLounge = function() {};

    return Spammer;

  })();

  BetSpammer = (function(_super) {
    __extends(BetSpammer, _super);

    function BetSpammer() {
      return BetSpammer.__super__.constructor.apply(this, arguments);
    }

    BetSpammer.prototype.spamLounge = postToFreezeReturn;

    BetSpammer.prototype.addButton = function() {
      this.spamButton = $('<a class="button" id="loungespammer-button">Spam place bet</a>');
      $('#freezebutton').after(this.spamButton);
      return BetSpammer.__super__.addButton.apply(this, arguments);
    };

    return BetSpammer;

  })(Spammer);

  ReturnsSpammer = (function(_super) {
    __extends(ReturnsSpammer, _super);

    function ReturnsSpammer() {
      this.button = $('#placebut');
      ReturnsSpammer.__super__.constructor.apply(this, arguments);
    }

    ReturnsSpammer.prototype.spamLounge = function() {
      return this.button.click();
    };

    ReturnsSpammer.prototype.addButton = function() {
      this.spamButton = $('<a class="button" id="loungespammer-button">Spam request returns</a>');
      $('#freezebutton').after(this.spamButton);
      return ReturnsSpammer.__super__.addButton.apply(this, arguments);
    };

    return ReturnsSpammer;

  })(Spammer);

  init = function() {
    var url;
    url = window.location.href;
    if (url.match('mybets' !== null)) {
      return new ReturnsSpammer;
    } else if (url.match('match' !== null)) {
      return new BetSpammer;
    }
  };

  $(function() {
    return init();
  });

}).call(this);
