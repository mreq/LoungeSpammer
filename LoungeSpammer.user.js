// ==UserScript==
// @name        LoungeSpammer
// @namespace   LoungeSpammer
// @author      mreq http://github.com/mreq
// @include     http://csgolounge.com/*
// @include     http://dota2lounge.com/*
// @version     0.2.2
// @downloadURL http://cdn.mreq.eu/LoungeSpammer.user.js
// @updateURL   http://cdn.mreq.eu/LoungeSpammer.user.js
// @grant       none
// ==/UserScript==

var Base, BetSpammer, BotsChecker, ReturnsSpammer, Spammer, init,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = (function() {
  function Base() {}

  Base.prototype.initNotifications = function() {
    if (!('Notification' in window)) {
      return this.notify = function() {
        return console.log('Notifications not supported.');
      };
    } else if ((window.Notification.permission !== 'granted') && (window.Notification.permission !== 'denied')) {
      return this.permitNotifications();
    }
  };

  Base.prototype.permitNotifications = function() {
    return window.Notification.requestPermission((function(_this) {
      return function(p) {
        if (!('permission' in window.Notification)) {
          window.Notification.permission = p;
        }
        if (p !== 'granted') {
          _this.notify = function() {
            return console.log('Notifications not allowed.');
          };
        }
        return _this.notify('Success! LoungeSpammer can now use notifications.');
      };
    })(this));
  };

  Base.prototype.notify = function(body) {
    var options;
    options = {
      body: body,
      icon: 'http://i.imgur.com/bWiPLuy.png'
    };
    return new window.Notification('LoungeSpammer', options);
  };

  return Base;

})();

BotsChecker = (function(_super) {
  __extends(BotsChecker, _super);

  function BotsChecker() {
    this.createBox();
    this.check();
    this.autoChecking = false;
    this.bindButton();
  }

  BotsChecker.prototype.createBox = function() {
    this.wrap = $('<div style="padding: 8px 10px;">Bots status: <div id="loungespammer-status" style="color: green; font-weight: bold; font-size: 130%; width: 100%;">&nbsp;</div><div id="loungespammer-status-spam" style="display: none; width: 100%; cursor: pointer; color: #FF8A00;">Notify me when they go online!</div><div style="width: 100%;"><em>Does this script help you?</em> Be kind and say <a href="http://steamcommunity.com/tradeoffer/new/?partner=16222794&token=BOqXsQwB" target="_blank" style="background: none; padding: 0; display: inline; float: none; text-decoration: none; border: 0;">thanks to the author</a> &lt;3.</div></div>');
    $('#submenu').prepend(this.wrap);
    this.content = this.wrap.find('#loungespammer-status');
    return this.button = this.wrap.find('#loungespammer-status-spam');
  };

  BotsChecker.prototype.check = function() {
    return $.get('status', (function(_this) {
      return function(data) {
        var old;
        old = _this.online;
        _this.online = data.match('BOTS ARE ONLINE') !== null;
        if (old !== _this.online) {
          _this.correctContent();
        }
        if (_this.autoChecking && _this.online) {
          clearInterval(_this.interval);
          return _this.notify('Bots are now online!');
        }
      };
    })(this));
  };

  BotsChecker.prototype.autoCheck = function() {
    this.autoChecking = true;
    this.i = 0;
    this.interval = setInterval(((function(_this) {
      return function() {
        _this.i++;
        _this.check();
        return _this.button.text("Bots still offline, checking every 30 seconds. Last checked at " + (Date().match(/\d+:\d+:\d+/)[0]) + ".");
      };
    })(this)), 30000);
    this.i++;
    this.check();
    return this.button.css('color', '').text("Bots still offline, checking every 30 seconds. Last checked at " + (Date().match(/\d+:\d+:\d+/)[0]) + ".");
  };

  BotsChecker.prototype.bindButton = function() {
    return this.button.one('click', (function(_this) {
      return function() {
        _this.initNotifications();
        return _this.autoCheck();
      };
    })(this));
  };

  BotsChecker.prototype.correctContent = function() {
    if (this.online) {
      this.content.text('ONLINE').css('color', 'green');
      return this.button.hide();
    } else {
      this.content.text('OFFLINE').css('color', 'red');
      return this.button.show();
    }
  };

  return BotsChecker;

})(Base);

Spammer = (function(_super) {
  __extends(Spammer, _super);

  function Spammer() {
    this.overwriteAlert();
    this.addButton();
  }

  Spammer.prototype.createBox = function() {
    this.box = $("<section class=\"box\" style=\"display: none;\">\n	<div class=\"title\">Status</div>\n		<article class=\"standard\" style=\"margin-top: 50px; margin-bottom: 0;\" id=\"loungespammer\"></article>\n		<article class=\"standard\" style=\"margin-top: 19px;\"><em>Does this script help you?</em> Be kind and say <a href=\"http://steamcommunity.com/tradeoffer/new/?partner=16222794&token=BOqXsQwB\" target=\"_blank\">thanks to the author</a> &lt;3.</article>\n</section>");
    $('#main > .box').first().after(this.box);
    return this.content = this.box.find('#loungespammer');
  };

  Spammer.prototype.overwriteAlert = function() {
    this.i = 0;
    this.messages = [];
    this.createBox();
    return window.alert = (function(_this) {
      return function(c) {
        _this.box.show();
        if (_this.messages.indexOf(c) === -1) {
          _this.messages.push(c);
        }
        return _this.content.html("<strong>" + c + "</strong><br><br>\nTried " + _this.i + " times over the last " + (Math.floor((Date.now() - _this.startTime) / 60000)) + " minute(s).<br><br>\nMessages so far:<br>\n<ul style=\"padding-left: 30px;\">\n	<li style=\"padding-top: 5px;\">" + (_this.messages.join('<li style="padding-top: 5px;"></li>')) + "</li>\n</ul>");
      };
    })(this);
  };

  Spammer.prototype.startSpamming = function() {
    this.startTime = Date.now();
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
        _this.initNotifications();
        return _this.startSpamming();
      };
    })(this));
  };

  Spammer.prototype.spamLounge = function() {
    this.i++;
    return this.button.click();
  };

  return Spammer;

})(Base);

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

  BetSpammer.prototype.startSpamming = function() {
    BetSpammer.__super__.startSpamming.apply(this, arguments);
    return $(document).on('ajaxSuccess', (function(_this) {
      return function(a, b, c) {
        if (!c.data) {
          if (c.url === 'ajax/postBet.php') {
            return _this.notify('Placed bet.');
          } else if (c.url === 'ajax/postBetOffer.php') {
            return _this.notify('Got a place bet trade offer.');
          }
        }
      };
    })(this));
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
    $(document).on('ajaxSuccess', (function(_this) {
      return function(a, b, c) {
        if (!c.data) {
          if (c.url === 'ajax/postToReturn.php') {
            return _this.notify('Requested returns ready.');
          }
        }
      };
    })(this));
    return this.spamLounge();
  };

  return ReturnsSpammer;

})(Spammer);

init = function() {
  var url;
  url = window.location.href;
  if (url.match('mybets') !== null) {
    new ReturnsSpammer;
  } else if (url.match('match') !== null) {
    new BetSpammer;
  }
  return new BotsChecker;
};

init();
