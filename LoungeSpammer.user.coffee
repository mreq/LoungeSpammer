# coffee-no-wrap

class Spammer
	constructor: ->
		@overwriteAlert()
		@addButton()
	createBox: ->
		@box = $("""
			<section class="box">
				<div class="title">Status</div>
					<article class="standard" style="margin-top: 50px; margin-bottom: 0;" id="loungespammer"></article>
					<article class="standard" style="margin-top: 19px;"><em>Does this script help you?</em> Be kind and say <a href="http://steamcommunity.com/tradeoffer/new/?partner=16222794&token=BOqXsQwB" target="_blank">thanks to the author</a> &lt;3.</article>
			</section>
		""")
		$('#main > .box').first().after @box
		@content = @box.find('#loungespammer')
	overwriteAlert: ->
		@i = 0
		@messages = []
		window.alert = (c) =>
			@messages.push c  if @messages.indexOf(c) is -1
			@content.html """
				<strong>#{ c }</strong><br><br>
				Tried #{ @i } times over the last #{ Math.floor((Date.now()-@startTime)/60000) } minute(s).<br><br>
				Messages so far:<br>
				<ul style="padding-left: 30px;">
					<li style="padding-top: 5px;">#{ @messages.join('<li style="padding-top: 5px;"></li>') }</li>
				</ul>
			"""
	startSpamming: ->
		@startTime = Date.now()
		@createBox()
		@spamLounge()
		setInterval (=> @spamLounge()), 1500
	addButton: ->
		@spamButton.one 'click', => @startSpamming()
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

init()