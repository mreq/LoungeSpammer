# coffee-no-wrap

class Base
	constructor: ->

	initNotifications: ->
		if not ('Notification' of window)
			@notify = ->
				console.log 'Notifications not supported.'
		else if (window.Notification.permission isnt 'granted') and (window.Notification.permission isnt 'denied')
			@permitNotifications()
	permitNotifications: ->
		window.Notification.requestPermission (p) =>
			unless ('permission' of window.Notification)
			  window.Notification.permission = p
			unless p is 'granted'
				@notify = ->
					console.log 'Notifications not allowed.'
			@notify 'Success! LoungeSpammer can now use notifications.'
	notify: (body) ->
		options =
			body: body
			icon: 'http://i.imgur.com/bWiPLuy.png'
		new window.Notification 'LoungeSpammer', options

class BotsChecker extends Base
	constructor: ->
		@createBox()
		@check()
		@autoChecking = false
		@bindButton()
	createBox: ->
		@wrap = $('<div style="padding: 8px 10px;">Bots status: <div id="loungespammer-status" style="color: green; font-weight: bold; font-size: 130%; width: 100%;">&nbsp;</div><div id="loungespammer-status-spam" style="display: none; width: 100%; cursor: pointer; color: #FF8A00;">Notify me when they go online!</div><div style="width: 100%;"><em>Does this script help you?</em> Be kind and say <a href="http://steamcommunity.com/tradeoffer/new/?partner=16222794&token=BOqXsQwB" target="_blank" style="background: none; padding: 0; display: inline; float: none; text-decoration: none; border: 0;">thanks to the author</a> &lt;3.</div></div>')
		$('#submenu').prepend @wrap
		@content = @wrap.find('#loungespammer-status')
		@button = @wrap.find('#loungespammer-status-spam')
	check: ->
		$.get 'status', (data) =>
			old = @online
			@online = (data.match('BOTS ARE ONLINE') isnt null)
			@offline = (data.match('BOTS ARE ONLINE') isnt null)
			unless @online or @offline
				# page disabled/failed to load
				clearInterval(@interval)
				@content.text('UNKNOWN').css('color', 'yellow')
				@button.hide().after('<div style="width: 100%;">The <a href="/status" target="_blank" style="background: none; padding: 0; display: inline; float: none; text-decoration: none; border: 0;">Bots status</a> page is either disabled or doesn\'t load.</div>')
			else
				@correctContent()  unless old is @online
				if @autoChecking and @online
					clearInterval(@interval)
					@notify 'Bots are now online!'
	autoCheck: ->
		@autoChecking = true
		@i = 0
		@interval = setInterval (=>
			@i++
			@check()
			@button.text "Bots still offline, checking every 10 seconds. Last checked at #{ Date().match(/\d+:\d+:\d+/)[0] }."
		), 10000

		@i++
		@check()
		@button.css('color', '').text "Bots still offline, checking every 10 seconds. Last checked at #{ Date().match(/\d+:\d+:\d+/)[0] }."
	bindButton: ->
		@button.one 'click', =>
			@initNotifications()
			@autoCheck()
	correctContent: ->
		if @online
			@content.text('ONLINE').css('color', 'green')
			@button.hide()
		else
			@content.text('OFFLINE').css('color', 'red')
			@button.show()

class Spammer extends Base
	constructor: ->
		@overwriteAlert()
		@addButton()
	createBox: ->
		@box = $("""
			<section class="box" style="display: none;">
				<div class="title">Status</div>
					<article class="standard" style="margin-top: 50px; margin-bottom: 0;" id="loungespammer"></article>
					<article class="standard" style="margin-top: 19px;"><em>Does this script help you?</em> Be kind and say <a href="http://steamcommunity.com/tradeoffer/new/?partner=16222794&token=BOqXsQwB" target="_blank">thanks to the author</a> &lt;3.</article>
			</section>
		""")
		$('main > .box').first().after @box
		@box.next('.box').css 'float', 'right'
		@content = @box.find('#loungespammer')
	overwriteAlert: ->
		@i = 0
		@messages = []
		@createBox()
		window.alert = (c) =>
			@box.show()
			@messages.push c  if @messages.indexOf(c) is -1
			@content.html """
				<strong>#{ c }</strong><br><br>
				Tried #{ @i } times over the last #{ Math.floor((Date.now()-@startTime)/60000) } minute(s).<br><br>
				Messages so far:<br>
				<ul style="padding-left: 30px;">
					<li style="padding-top: 5px;">#{ @messages.join('</li><li style="padding-top: 5px;">') }</li>
				</ul>
			"""
	startSpamming: ->
		@startTime = Date.now()
		@spamLounge()
		setInterval (=> @spamLounge()), 1000
	addButton: ->
		@spamButton.one 'click', =>
			@initNotifications()
			@startSpamming()
	spamLounge: ->
		@i++
		@button.click()

class BetSpammer extends Spammer
	constructor: ->
		@button = $('#placebut')
		super
	addButton: ->
		@spamButton = $('<a class="buttonright" style="margin-left: 5px;" id="loungespammer-button">Spam place bet</a>')
		super
		@button.before @spamButton

class ReturnsSpammer extends Spammer
	constructor: ->
		@button = $('#freezebutton')
		super
	addButton: ->
		@spamButton = $('<a class="button" style="margin-left: 5px;" id="loungespammer-button">Spam request returns</a>')
		super
		@button.after @spamButton
	startSpamming: ->
		super
		@spamLounge()


init = ->
	url = window.location.href
	if url.match('mybets') isnt null
		new ReturnsSpammer
	else if url.match('match') isnt null
		new BetSpammer

	# new BotsChecker

init()