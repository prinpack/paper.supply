/*
Project: Billerud 2012, Project 60
Author: Jonas Jonell
Date: 2012-04-02

Contents
--------
1. General
2. Layout
3. Search handler
4. Social channels
5. Tooltip
6. Financial tables
7. Animated chart
8. Flexslider
9. Newsroom
10. GoogleMapHandler
11. Vacancy list


Constants
---------
Text color: #444;
Highlight color: #127e22;
Light shadow: #f2f2f2;
Dark shadow: #ccc;

*/


/* =========================================== General =========================================== */

var themecolors;
var ie6;
var lang;
var sectionClass;

// DOM loaded
$(function () {
	themecolors = '#f4aa00,#6ba763,#005a8c,#e57200,#eeeee8,#000000';
	ie6 = ($.browser.msie && $.browser.version === "6.0");
	lang = $('html').attr('lang');
	
	sectionClass = $('body').data('section');
	if (!sectionClass) 
		sectionClass = "";
});

$(function () {
    var input = $('input[type=text]');

    input.focus(function () {
        $(this).val('');
    }).blur(function () {
        var el = $(this);

        if (el.val() == '')
            el.val(el.attr('data'));
    });
});

$(function () {
    var textarea = $('textarea');

    textarea.focus(function () {
        $(this).val('');
    }).blur(function () {
        var el = $(this);

        if (el.val() == '')
            el.val(el.attr('data'));
    });
});

// Dom + Image loaded
$(window).load(function () {
    Layout.init();
    FinancialTables.init();
    Searchhandler.init();
    SocialChannels.init();
    Tooltip.init();
    aChart.init();
    Accordions.init();
    Tabpanels.init();
    DocumentLinks.init();
    drawGoogleChart();
    
    if (ie6) {
        Layout.disableFlexslider($('div.flexslider'));
    }
    else if ($(document).width() <= 420) {
        $('div.flexslider').flexslider({ animation: 'slide', directionNav: false, slideshow: false, controlNav: true });
        $('div.topslider').flexslider({ animation: 'slide', directionNav: true, slideshow: true, controlNav: false });
    }
    else {
    	if ($('body').hasClass('skog')) {
    		$('div.flexslider').flexslider({ animation: 'fade', directionNav: false, slideshow: true, controlNav: false });
    	} else {
    		$('div.flexslider').flexslider({ animation: 'fade', directionNav: false, slideshow: false, controlNav: false });
    	}
        
        $('div.topslider').flexslider({ animation: 'slide', directionNav: true, slideshow: true, controlNav: false });
        if ($.browser.msie) {
            //var img = $('div.flexslider').find('img').first();
            //img.replaceWith('<div style="position: static; height: 493px; width: 1176px; overflow: hidden;"><video class="video-js" width="1176" height="661" controls="controls" preload="preload" poster="/upload/Films/EmbracingTheGoods.jpg"><source src="http://www.billerud.se/movies/Billerud_57s_1080p_master_komprimerad.mp4" type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;" /></video></div>');
        }
    }

    Newsroom.init();
    OurOffer.init();
    ProductsMarkets.init();
    GoogleMapHandler.init();
    Videoplayers.init();
	Vacancy.init();
});

// Date month name
Date.prototype.getMonthName = function (lang) {
	lang = lang && (lang in Date.locale) ? lang : 'en';
	return Date.locale[lang].monthName[this.getMonth()];
};

Date.prototype.getMonthAbbr = function (lang) {
	lang = lang && (lang in Date.locale) ? lang : 'en';
	return Date.locale[lang].monthName[this.getMonth()].substring(0, 3);
};

Date.locale = {
	en: {
		monthName: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	},
	sv: {
		monthName: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December']
	}
};


/* =========================================== Layout =========================================== */
var Layout = {
	compactNavUrl: null,

	init: function () {
		var tabviews = $('div.tabview');
		tabviews.tabs();
	    /*tabviews.each(function() {
		var tabview = $(this);
		var ul = tabview.children('.ui-tabs-nav');
		//alert(ul.outerHeight()); 
		//alert(ul.children('li').outerHeight());
		});*/
		
		Layout.equalHeights($('#globalfooterwidgets, #contentfooterwidgets'));
		
		//if ('ontouchend' in document.documentElement) {
		//	Searchhandler.InitIndex(function () {
				Layout.setupCompactMode();
		//	});
		//}
		
		Layout.initMultipleRss();
		Layout.initStartpage();
	},

	initStartpage: function () {
		var video = $('#backgroundVideo');
		if (video.length > 0) {
		//	$(window).resize(function () {
		//		alert('asd');
		//		video.css({
		//			'width': 'auto',
		//			'height': video.parent().height(),
		//			'margin-left': 0,
		//		});
		//		var widthOverflow = video.width() - video.parent().width();
		//		if (widthOverflow < 0) {
		//			video.css({
		//				width: video.parent().width(),
		//				height: 'auto'
		//			});
		//		}
		//		else {
		//			video.css('margin-left', -(widthOverflow / 2));
		//		}
		//	});
		//	setTimeout(function () {
		//		$(window).resize();
		//	}, 0);
		}

		var videotexts = $('#videotexts').children();
		if (videotexts.length > 0) {
			var texttimers = [7000, 12000, 39000, 44000, 67000, 73000, 96000, 100000, 124000, 130000];
			var fadeIn = function (i) {
				setTimeout(function () {
					var text = $(videotexts[i]);
					text.fadeIn(2000);
					setTimeout(function () {
						text.fadeOut(2000);
					}, 2000);
				}, texttimers[i]);
			}

			for (var i = 0; i < texttimers.length; i++) {
				fadeIn(i);
			}
		}
	},

	equalHeights: function (target) {
		var i = 0;
		var cells = new Array();

		var equalRow = function (height) {
			if (cells.length === 1) {
				cells.pop();
			}
			while (cells.length > 0) {
				var widget = cells.pop().children().first();
				if (widget.hasClass('buttonwidget')) {
					widget.find('a.button').css('margin-top', height - widget.height() - 13);
				}
				widget.innerHeight(height - 17);
			}
		};

		target.each(function () {
			var maxHeight = 0;
			var children = $(this).children();
			if (children.length == 0) { return; }
			var offsettop = children.first().offset().top;

			children.each(function () {
				var item = $(this);
				if (item.offset().top > offsettop) {
					equalRow(maxHeight);
					offsettop = item.offset().top;
					maxHeight = 0;
				}
				cells.push(item);
				if (item.innerHeight() > maxHeight) {
					maxHeight = item.innerHeight();
				}
			});
			equalRow(maxHeight);
		});
	},

	setupCompactMode: function () {
		var currentNav = null;
		var hideMenu = null;

		var clickevtname = 'click';
		if ('ontouchend' in document.documentElement) {
			clickevtname = 'touchend';
		}

		// navigation system --------------- 
		var mobilenav = $('<div id="mobilenav"></div>').appendTo(document.body);
		var mobilenavheader = $('<div class="mobileheader"><span>Meny</span></div>').appendTo(mobilenav);
		var mobilenavitems = $('<div id="mobilenavitems"></div>').appendTo(mobilenav);
		var mobilebtnback = $('<a class="mobilebutton" id="mobileback">Back</a>').appendTo(mobilenavheader);
		var mobilecurrentnavId = null;

		var getMenu = function (li) {
			var menu = $('<ul></ul>');
			li.children('ul').children('li').each(function () {
				var id = $(this).attr('id');
				var cssClass = $(this).children('ul').length > 0 ? ' class="hasChildren"' : '';
				var url = $(this).children('a').attr('href');

				// If "Exclude from SiteMap", don't show in menu
				if (url == null)
					return;

				var title = $(this).children('a').children('div').html();
				$('<li id="m' + id + '" href="' + url + '" ' + cssClass + '><span>' + title + '</span></li>').appendTo(menu).click(navigateforward);
			});
			return menu;
		};

		var initCompactMenu = function () {
			var li = Searchhandler.SearchMap.find('#searchpage' + document.body.id.substring(4));
			// if this page does not have any subpages
			if (li.children('ul').length === 0) {
				li = li.parent().closest('li');
			}
			mobilecurrentnavId = li[0].id;
			currentNav = getMenu(li).appendTo(mobilenavitems);
			mobilebtnback.bind(clickevtname, navigateback);
			if (li.parent().closest('li').length > 0) {
				// this is not the startpage, show the "back" button
				mobilebtnback.css('opacity', 1).show()
				mobilenavheader.children('span').html(li.children('a').children('div').text());
			}

			var bodyheight = $(document.body).height();
			if (bodyheight === 0) {
				bodyheight = '100%';
			}
			else {
				bodyheight = bodyheight + 'px';
			}
			mobilenav.height(bodyheight).css('clip', 'rect(0, 255px, ' + bodyheight + ', 0)');

		};

		var swipeMenu = function () {
			if (mobileheader.hasClass('expandedmenu')) {
				$('form, #mobileheader, #videocover').removeClass('expandedmenu');
				btnshowmenu.html('Meny');
				hideMenu = setTimeout(function () { mobilenav.hide(); }, 500);
			}
			else {
				if (currentNav === null) {
					initCompactMenu();
				}
				clearTimeout(hideMenu);
				mobilenav.show();
				btnshowmenu.html('Stäng');
				$('form, #mobileheader, #videocover').addClass('animate expandedmenu');
			}
		};

		var mobileheader = $('<header id="mobileheader" class="mobileheader"></header>').prependTo(document.body);
		var btnshowmenu = $('<a class="mobilebutton" id="showNav">Meny</a>').appendTo(mobileheader).bind(clickevtname, swipeMenu);

		if ($('body').hasClass('fresh'))
			$('<img src="/UI/styles/graphics/logotype_fresh_services.png">').appendTo(mobileheader);
		else
			$('<img src="/UI/styles/graphics/korsnas/logotype-neg.png">').appendTo(mobileheader);

		$('<a class="mobilebutton" id="swapSearch"><span>Search</span></a>').appendTo(mobileheader).bind(clickevtname, function () {
			var btn = $(this);
			
			if (btn.hasClass('visible')) {
				window.scrollTo(0, 0);
				Searchhandler.SearchBox.blur();
				btn.removeClass('visible');
				$('#searchfield').parent().removeClass('expandedsearchpanel').removeClass('animate');
				$('header.cols').css('top', 0);
			}
			else {
				btn.addClass('visible');
				$('header.cols').css('top', $('form#aspnetForm').scrollTop() + 44);
				setTimeout(function () { $('#searchfield').parent().addClass('animate expandedsearchpanel'); }, 0);
			}
		});

		// fixed scrolling (only on iOS 5) --------------- 
		var getScrollTop = function () {
			return window.pageYOffset || document.compatMode === 'CSS1Compat' && document.documentElement.scrollTop || document.body.scrollTop || 0;
		};
		if ("webkitOverflowScrolling" in document.body.style) {
			/*
			$('html').addClass('touchscroll');
			var supportOrientation = typeof window.orientation != 'undefined';
			var scrollTop = function () {
			if (!supportOrientation) return;
			document.body.style.height = screen.height + 'px';
			setTimeout(function () {
			window.scrollTo(0, 1);
			var top = getScrollTop();
			window.scrollTo(0, top === 1 ? 0 : 1);
			document.body.style.height = window.innerHeight + 'px';
			}, 1);
			};
			scrollTop();
			$('form').bind('touchstart', function () {
			if (mobileheader.is(':visible')) {
			window.scrollTo(0, 0);
			}
			});
			if (supportOrientation) { window.onorientationchange = scrollTop; }

			$('form#aspnetForm').bind('scroll', function () {
			var btn = $('#swapSearch');
			if (btn.hasClass('visible')) {
			btn.trigger(clickevtname);
			}
			});*/
		}

		$('<div id="menushadow"></div>').appendTo(mobilenav);

		var navigateback = function () {
			var li = Searchhandler.SearchMap.find('#' + mobilecurrentnavId);
			li = li.parent().closest('li');
			var mobilenavheadertitle = mobilenavheader.children('span');
			//mobilenavheadertitle.fadeOut();
			var newtitle = li.children('a').children('div').text();
			mobilecurrentnavId = li[0].id;
			var newmenu = getMenu(li);
			//newmenu.prependTo(mobilenavitems);
			mobilenavitems.html(newmenu);
			mobilenavheadertitle.html(newtitle).fadeIn();
			/*
			mobilenavitems.addClass('collapsedmenu');
			setTimeout(function () {
			mobilenavitems.addClass('animate').removeClass('collapsedmenu');
			}, 0);

			if (li.parent().closest('li').length === 0) {
			// we are at top level, hide the back-button
			mobilebtnback.animate({ 'opacity': 0 }, 400, function () { $(this).hide(); });
			newtitle = 'Meny';
			}
			setTimeout(function () {
			mobilenavheadertitle.html(newtitle).fadeIn();
			currentNav.remove();
			mobilenavitems[0].className = '';
			currentNav = newmenu;
			}, 400);*/
		};

		var navigateforward = function (event) {
			var target = $(event.currentTarget);
			if (target.hasClass('hasChildren')) {
				var mobilenavheadertitle = mobilenavheader.children('span');
				//mobilenavheadertitle.fadeOut();
				mobilecurrentnavId = target[0].id.substring(1);
				var li = Searchhandler.SearchMap.find('#' + mobilecurrentnavId);
				var newmenu = getMenu(li);
				//newmenu.appendTo(mobilenavitems);
				mobilenavitems.html(newmenu);
				mobilenavheadertitle.html(target.text());
				/*
				mobilenavitems.addClass('animate collapsedmenu');
				if (mobilebtnback.is(':hidden')) {
				mobilebtnback.show().animate({ 'opacity': 1 }, 400);
				}
				setTimeout(function () {
				mobilenavheadertitle.html(target.text()).fadeIn();
				currentNav.remove();
				mobilenavitems[0].className = '';
				currentNav = newmenu;
				}, 400); */
			}
			else {
				document.location = target.attr('href');
			}
		};
	},

	disableFlexslider: function (target) {
		target.find('li:not(:first-child)').hide();
	},

	initMultipleRss: function () {
		$('div.multiplerss').each(function () {
			var container = $(this);
			container.children('ul').children('li').click(function () {
				var li = $(this);
				li.addClass('ui-tabs-selected').siblings().removeClass('ui-tabs-selected');
				var cssClass = li.children('a')[0].className;
				if (cssClass === 'rss-all') {
					container.children('div').slideDown();
				}
				else {
					container.children('div.' + cssClass).slideDown();
					container.children('div:not(div.' + cssClass + ')').slideUp();
				}
			});
		});
	}
};

var Accordions = {
	init: function () {
		var content = $('#primarycontent').children('article').children('div:not(.intro)');
		var accordionSelector = content.attr('data-accordion');
		if (accordionSelector) {
			var autoCollapse = (content.attr('data-autocollapse') == 'true');
			var previousAccordion = null;
			var accordionLevel = parseInt(accordionSelector.substring(1));
			var accordionCancel = '';
			for (var i = 2; i < accordionLevel + 1; i++) {
				accordionCancel += ', h' + i;
			}
			accordionCancel = accordionCancel.substring(2);
			content.find(accordionSelector).each(function () {
			    if ($(this).hasClass('noaccordion'))
			    {
			        return;
			    }
				var heading = $(this).addClass('accordion').click(function () {
					if (autoCollapse && previousAccordion && (previousAccordion.prev().html() != $(this).html())) {
						previousAccordion.slideUp('fast').prev().removeClass('accordion-expand');
					}
					previousAccordion = $(this).toggleClass('accordion-expand').next().slideToggle('fast');

				});
				var content = heading.nextUntil(accordionCancel).wrapAll('<div class="accordioncontent" />');
				if (content.find('span.highlight').length > 0) {
					content.closest('div').prev().click();
				}
			});
		}
	}
};

var Tabpanels = {
	init: function () {
		var content = $('#primarycontent').children('article').children('div:not(.intro)');
		var tabpanelSelector = content.attr('data-tabpanel');
		if (tabpanelSelector) {
			var tabpanelLevel = parseInt(tabpanelSelector.substring(1));
			var tabpanelCancel = '';
			for (var i = 2; i < tabpanelLevel + 1; i++) {
				tabpanelCancel += ', h' + i;
			}
			tabpanelCancel = tabpanelCancel.substring(2);
			var headings = content.find(tabpanelSelector);
			var i = 0;
			var tabs = $('<ul />');
			headings.each(function () {
				var heading = $(this);
				var tab = $('<li><a href="#tabpanel' + i + '">' + heading.html() + '</a></li>').appendTo(tabs);
				var content = heading.nextUntil(tabpanelCancel).andSelf().wrapAll('<div id="tabpanel' + i + '" />');
				i++;
			});
			tabs.insertBefore(headings.first().parent());
			content.tabs();
		}
	}
};


/* =========================================== Search handler =========================================== */

var Searchhandler = {
	Index: null,
	SearchBox: null,
	ResultBox: null,
	SearchMap: null,

	init: function () {
		Searchhandler.ClassNameForHightlightedListItems = 'highlight';
		Searchhandler.CurrentActiveSearchResult = 1;
		Searchhandler.Index = [];
		Searchhandler.Results = [];
		Searchhandler.LastSearchTerm = "";
		Searchhandler.Scope = 1;
		Searchhandler.SearchBox = $('input#search');
		Searchhandler.InitFocusBlur(Searchhandler.SearchBox);
		Searchhandler.InitIndex();
		$(Searchhandler.SearchBox).keyup(Searchhandler.Search);
		Searchhandler.HighlightCurrentSearch();
	},

	InitFocusBlur: function (searchBox) {
		// the initlabel is the initial text within the search input box. On focus it should be removed. On blur it should be appended

		var initiallabel = searchBox.val();
		searchBox.focus(function () {
			if (this.value === initiallabel) {
				this.value = '';
			}
		}).blur(function () {
			if (this.value === '') {
				this.value = initiallabel;
			}
		});
	},

	InitIndex: function (callback) {
		if (sectionClass.length > 0)
			sectionClass += "-";

		$.get('/global/data/Searchmap-' + sectionClass + lang + '.html?rnd=' + Math.random.call(), function (data) {
			Searchhandler.Index = [];
			Searchhandler.SearchMap = $(data);
			var count = Searchhandler.InitChildren(Searchhandler.SearchMap, 'Home', 0, 0);
			if (callback) {
				callback();
			}
		});
		//}).error(function (msg) { alert(msg.responseText); });

		if (!$('body').hasClass('fresh') && !$('body').hasClass('skog')) {

			if (Searchhandler.SearchBox === null)
				Searchhandler.SearchBox = $('input#search');

			Searchhandler.ResultBox = $(document.createElement('div'))
			.attr('id', 'quick-searchresults')
			.width(Searchhandler.SearchBox.parent().outerWidth())
			.css('top', Searchhandler.SearchBox.offset().top + Searchhandler.SearchBox.outerHeight())
			.appendTo('body')
			.hide();
		}
	},

	InitChildren: function (data, path, index, level) {
		data.find('> li').each(function () {

			var anchor = $(this).find('> a');
			var children = $(this).find('> ul');
			var breadcrumb = path + '/' + pagename;
			var pagename = anchor.find('> div').html();
			var url = unescape(anchor.attr('href'));
			var synonyms = anchor.find('> span').html();

			if (anchor.length < 1) {
				index = Searchhandler.InitChildren(children, breadcrumb, index, level);
				return;
			}

			Searchhandler.Index[index] = [pagename, url, breadcrumb, pagename + synonyms, level, children.length > 0];
			index = Searchhandler.InitChildren(children, breadcrumb, index + 1, level + 1);
		});
		return index;
	},

	Search: function () {
		if (Searchhandler.Index.length === 0) {
			Searchhandler.InitIndex(Searchhandler.Search);
		}
		else {
			var term = Searchhandler.SearchBox[0].value.toLowerCase();
			if (term.length < 2) {
				Searchhandler.ResultBox.hide();
				return;
			}

			var result = '';
			for (var i = 0; i < Searchhandler.Index.length; i++) {
				if (Searchhandler.Index[i][3].toLowerCase().indexOf(term) > -1) {
					result += '<a href="' + Searchhandler.Index[i][1] + '" title="' + Searchhandler.Index[i][2] + '">' + Searchhandler.Index[i][0] + '</a>';
				}
			}
			Searchhandler.ResultBox.toggle(result !== '').html(result).css('left', Searchhandler.SearchBox.offset().left);
		}
	},

	HighlightCurrentSearch: function () {
		var search = $.QueryString['search'];
		if (search) {
			$('#primarycontent').highlight(search);
		}
	}
};

/* ===========================================  Social channels =========================================== */

var SocialChannels = {
	init: function () {
		$('div.socialchannel').each(function () {
			var playerheight = 315;
			if ($(this).hasClass('slidesharechannel')) {
				playerheight = 435;
			}

			var channel = $(this).children('div.widget');
			var container = channel.children('div').hide();
			var thumb = container.children('a:first').children('img').clone();
			var src = thumb.attr('src').replace('/2.jpg', '/0.jpg').replace('_s.jpg', '_d.jpg');
			if (!ie6) {
				thumb.attr('src', src);
			}

			thumb.css('cursor', 'pointer').prependTo(channel);
			container.children('h2').prependTo(channel);
			container.wrapInner('<div class="cliplist" />');

			var playercontainer = $('<div class="playercontainer" />').prependTo(container);
			var cliptext = $('<p />').prependTo(playercontainer);
			var player;
			if ($(this).hasClass('youtubechannel') || $(this).hasClass('slidesharechannel')) {
				player = $('<div><iframe width="560" height="' + playerheight + '" frameborder="0" allowfullscreen></iframe></div>').prependTo(playercontainer);
			}
			else if ($(this).hasClass('flickrchannel')) {
				player = $('<a title="" href="" class="flickrplayer"><img /></a>').prependTo(playercontainer);
				container.children('div.cliplist').addClass('flickrcliplist');
			}
			var cliptitle = channel.children('h2').clone().prependTo(playercontainer);

			container.children('div').children('a:not(.flickrplayer)').click(function (event) {
				var link = $(this);
				player.children().first().attr('src', link.attr('href'));
				if (link.parent().hasClass('flickrcliplist')) {
					var title = link.children('h3').html() + ' \n' +
						link.children('p').first().text() +
						' \n(Click to view more sizes at Flickr)'
					player.attr('href', link.children('p.flickrlink').attr('title'))
						.attr('title', title);
				}
				else {
					cliptext.html(link.children('p').html());
				}
				return false;
			});

			thumb.click(function () {
				container.find('a:not(.flickrplayer)').first().click();
				var dialogwidth = 940;
				var dialogleft = ($(document).width() - dialogwidth) / 2;
				container.dialog({
					width: dialogwidth,
					modal: true,
					title: '<h2>' + channel.children('h2').html() + '</h2>',
					position: [dialogleft, 100],
					close: function (event, ui) { container.dialog('destroy'); }
				});
			});

			container.css('background', 'white');
		});
	}
};

/* =========================================== Tooltip =========================================== */

var Tooltip = {
	init: function () {
		$('*[title]').each(function () {
			if (!$(this).parents('.map_canvas')) {
				var elem = $(this);
				var tooltipText = elem.attr('title');
				elem.removeAttr('title').addClass('hastooltip');
				var isImage = (this.tagName.toLowerCase() === 'img');

				var tooltip = $('<div class="tooltip" />').html(tooltipText).append('<span class="arrow" />').appendTo(document.body).hide();
				elem.mouseenter(function(event) {
					var pos = elem.offset();
					tooltip.css('top', pos.top - 30 - tooltip.height())
						.css('left', pos.left + (elem.width() / 2))
						.fadeIn('fast');
				}).mouseleave(function() {
					tooltip.fadeOut('fast');
				});
			}
		});
	}
};
/* =========================================== Document links ============================================= */
// Opens certain document in a new tab

var DocumentLinks = {
    init: function () {
        $('a[href$=".pdf"], a[href$=".xls"], a[href$=".xlsx"], a[href$=".doc"], a[href$=".docx"], a[href$=".ppt"], a[href$=".pptx"]')
        .attr('target', '_blank');
    } 
}
/* =========================================== Financial tables =========================================== */

var FinancialTables = {
	init: function () {
		var container = $('div#financialtables');
		if (container.length > 0) {
			var barMaxHeight = 100;
			FinancialTables.initDrilldown(container);
			FinancialTables.initInlineChart(container, barMaxHeight, 'mouseenter', false);
			FinancialTables.initFixedScroll(container, barMaxHeight);
			FinancialTables.initTabView(container);
			//FinancialTables.initExtras(container);
			//FinancialTables.initCurrencyConverter(container);
		}
	},

	initDrilldown: function (container) {
		var rows = container.find('tr.lev1');
		rows.children('th').wrapInner('<span />');
		var btn = $('<a />').addClass('collapsed').click(function (event) {
			var a = $(this);
			a.toggleClass('expanded')
				.closest('tr')
				.nextUntil('tr:not(.lev1)')
				.toggle();

			if (a.closest('table').hasClass('fixedcolumn')) {
				var subtable = a.closest('table').prev().find('table tbody');
				var rowindex = a.closest('tr').index();
				var tr = subtable.children('tr:nth-child(' + (rowindex + 1) + ')');
				tr.nextUntil('tr:not(.lev1)').toggle();
			}
			event.stopPropagation();
		});
		rows.prev(':not(tr.lev1)').children('th').wrapInner(btn);
	},

	initInlineChart: function (container, barMaxHeight, trigger, explicitChart) {
		if (trigger === 'mouseenter') {
			container.children().mouseleave(function () {
				$(this).find('tr').removeClass('chart');
			});
		}
		container.find('table').addClass('hascharts').children('tbody').children('tr').bind(trigger, function () {
			var tr = $(this);
			if ((trigger !== 'mouseenter') && tr.hasClass('chart')) {
				tr.parent().children('tr').removeClass('chart');
			}
			else {
				tr.parent().children('tr').removeClass('chart');
				// the bars will be visible when the selected-class is applied
				tr.addClass('chart');

				// only add bars if bars has not been added before
				if (tr.find('td span').length === 0) {
					var cells = tr.children('td');
					var getNumericValueOfCell = function (cell) {
					    var returnvalue;
					    if (lang === 'en') {
					        returnvalue = parseFloat(cell.text().replace(/<[^>]+>/, "").replace("&nbsp;", "").replace(" ", "").replace(",", "")); //Komma som tusentalsseparator
					    }
					    else if (lang === 'sv') {
					        returnvalue = parseFloat(cell.text().replace(/<[^>]+>/, "").replace("&nbsp;", "").replace(" ", "").replace("\xa0", "").replace(",", ".")); //Komma som decimaltecken
					    }
					    else {
					        returnvalue = parseFloat(cell.text().replace(/<[^>]+>/, "").replace("&nbsp;", "").replace(" ", "").replace("\xa0", "").replace(/[,.]/, ""));
					    }
					    return returnvalue;
					};
					var maxValue = 0;
					cells.each(function () {
						var value = Math.abs(getNumericValueOfCell($(this)));
						if (value && value > maxValue) {
							maxValue = value;
						}
					});
					var stapleHeight = 0;
					var firstvalue = getNumericValueOfCell(cells.first());

					cells.each(function () {
						var cell = $(this);
						var value = getNumericValueOfCell(cell);
						if (!isNaN(value)) {
							var height = Math.floor(barMaxHeight * (value / maxValue));
							var cssClass = 'bar';
							if (height < 0) {
								cssClass += ' negative';
								height = -height;
							}
							var span = $('<span />').addClass('bar');
							var change = '';
							if (cell.index() > 1 && explicitChart) {
								var unitchange = Math.round(100 * ((firstvalue / value) - 1));
								if (unitchange === 0) {
									unitchange = '&plusmn;0';
								}
								else if (unitchange > 0) {
									unitchange = '+' + unitchange;
								}

								change = '<span class="change">' + unitchange + '%</span>';
							}
							cell.append('<div class="' + cssClass + '" style="height: ' + height + 'px;">' + change + '</div>').wrapInner(span);
						}
					});
				}
			}

			// add support for fixed column --------------- 
			var rowindex = tr.closest('tr').index();
			if (tr.closest('table').hasClass('fixedcolumn')) {
				var subtable = tr.closest('table').prev().find('table tbody');
				subtable.children('tr:nth-child(' + (rowindex + 1) + ')').trigger(trigger);
			}
			else if (tr.closest('div').hasClass('scrollable')) {
				var covertable = tr.closest('div.scrollpanel').next().children('tbody');
				covertable.children('tr').removeClass('chart').filter('tr:nth-child(' + (rowindex + 1) + ')')[0].className = tr[0].className;
			}
		});
	},

	initFixedScroll: function (container, barMaxHeight) {
		container.find('table').each(function () {
			var origWidth = $(this).parent().width();
			var table = $(this);
			var tablepanel = table.parent().width(10000);
			var scrollpanel = $('<div />').addClass('scrollpanel');
			var scrollarea = $('<div />').addClass('scrollable').width(table.width());

			tablepanel.append(scrollpanel);
			scrollpanel.append(scrollarea);
			scrollarea.append(table);

			if (table.hasClass('hascharts')) {
				// add margin to the table to ensure chart bars are visible even for the top rows
				table.find('th').first().css('padding-top', barMaxHeight - table.children('thead').height() - 20);
			}
			if (!ie6) {
				var newtable = table.clone(true).addClass('fixedcolumn');
				tablepanel.append(newtable);

				var sourceHeadRows = table.children('thead').children('tr');
				var targetHeadRows = newtable.children('thead').children('tr');
				targetHeadRows.each(function (index) {
					var row = $(this);
					row.css('height', $(sourceHeadRows[index]).height() - 1);
				});
				targetHeadRows.children('th:not(:first-child)').remove();
				newtable.children('tbody').children('tr').children('td').remove();
			}
			tablepanel.width('');
		});
	},

	initTabView: function (container) {
		var tblswith = $('<ul />');
		var i = 0;
		container.find('table:not(.fixedcolumn) thead th.subheading').each(function () {
			var th = $(this);
			var id = 'tbl-' + i;
			th.closest('div.tablepanel').attr('id', id);
			tblswith.append('<li><a href="#' + id + '">' + th.html() + '</a></li>');
			i++;
		});
		tblswith.prependTo(container);
		container.tabs();
	},

	initExtras: function (container) {
		var tableextras = container.next();
		var type = 'year';
		container.find('table:not(.fixedcolumn)').each(function () {
			var table = $(this);
			var cells = table.find('td');
			table.children('thead').children('tr:last-child').children('th:not(:first-child)').each(function () {
				var cell = $(this);
				var extra = tableextras.children('div#tableextra-' + type + '-' + cell.index());
				if (extra.length > 0) {
					var a = $('<a />').click(function () {
						$('div.tooltipabove').remove();
						var pos = cell.offset();
						extra.dialog({
							dialogClass: 'tooltipabove',
							draggable: false,
							resizable: false,
							height: 100,
							position: [pos.left - 125, pos.top - 100]
						});
						event.stopPropagation();
					});
					cell.wrapInner(a);
					cells.filter(':nth-child(' + (cell.index() + 1) + ')').mouseenter(function () {
						a.click();
					});
				}
			});
			type = 'quarter';
		});
		container.find('table.fixedcolumn').mouseenter(function () { $('div.tooltipabove').remove(); });
	},

	initCurrencyConverter: function (container) {
		$.get('/Scripts/Currencies.xml?rnd=' + Math.random.call(), function (data) {
			var xml = $(data);
			var currencyTools = $('<li />').attr('id', 'currencytools');
			$('<a />')
				.addClass('icon currency')
				.html('Change currency')
				.appendTo(currencyTools);

			var ul = $('<ul />').appendTo(currencyTools);

			var li = $('<li>' + xml.children('currencies').attr('base') + '</li>').appendTo(ul);
			li.click(function () {
				var cells = container.find('td');
				if (cells.first().attr('value') !== undefined) {
					cells.each(function () {
						var cell = $(this);
						cell.html(cell.attr('value'));
					});
				}
			});
			xml.find('currency').each(function () {
				var currency = $(this);
				var currencyValue = parseFloat(currency.attr('value'));
				li = $('<li>' + currency.attr('id') + '</li>');
				li.click(function () {
					var cells = container.find('td');

					// store the original value
					if (cells.first().attr('value') === undefined) {
						cells.each(function () {
							var cell = $(this);
							cell.attr('value', cell.text());
						});
					}

					// replace all values
					cells.each(function () {
						var cell = $(this);
						if (!isNaN(cell.attr('value'))) {
							var originalValue = parseFloat(cell.attr('value'));
							var newValue = Math.round(currencyValue * originalValue);
							cell.html(newValue);
						}
					});
				})
				.appendTo(ul);
			});

			currencyTools.appendTo($('ul#tabletools'));
		});
	}
};

/* =========================================== Animated chart =========================================== */

var aChart = {
	duration: 500,
	top: 20,
	left: 40,
	height: 200,
	maxBarWidth: 20,
	dotRadius: 4,
	lineThickness: 2,
	pieThickness: 40,
	mode: 'combination',
	colors: null,
	showZero: true,

	/* end of configuration */
	width: 0,
	scaleChange: false,
	legends: null,
	xAxis: null,
	currentSerie: 0,
	yAxis: null,
	series: [],
	years: [],
	r: null,
	// a and b is used for the y = ax + b linear function
	a: null,
	b: null,

	init: function () {
		var chart = $('div#animatedchart');
		if (chart.length === 0) { return; }
		aChart.colors = themecolors.split(',');
		aChart.width = (chart.width() * 0.64667) - aChart.left;

		aChart.legends = $('<div />').attr('id', 'legends').addClass(aChart.mode).appendTo(chart);
		aChart.r = Raphael(chart[0], chart.width(), chart.height());

		aChart.initData(chart);
		aChart.populateTogglePanel(chart);

		aChart.drawYAxis();
		aChart.xAxis = $('<div />')
			.attr('id', 'xaxis')
			.css('margin-top', (aChart.top + aChart.height + 10))
			.css('margin-left', aChart.left)
			.prependTo(chart);

		aChart.addViewTabs(chart);
		aChart.print(true);
	},

	addViewTabs: function (chart) {
		var tabs = $('<ul />')
			.attr('id', 'achart-tabs')
			.addClass('ui-tabs-nav')
			.prependTo(chart);

		var cssClass = aChart.mode === 'groupedbar' ? 'ui-state-default ui-tabs-selected' : 'ui-state-default';

		$('<li />').html('<a>Bars</a>').addClass(cssClass).appendTo(tabs).click(function () {
			if (aChart.mode !== 'groupedbar') {
				aChart.xAxis.fadeOut(function () {
					aChart.xAxis.html('');
				});
				$(this).parent().children('li').removeClass('ui-tabs-selected');
				$(this).addClass('ui-tabs-selected');
				var legends = aChart.legends.removeClass('combination').children('div');
				legends.each(function (index) {
					$(this).children('span.icon')[0].className = 'icon bar';
				});
				aChart.mode = 'groupedbar';
				aChart.print(false);
				setTimeout(function () {
					legends.each(function (index) {
						aChart.series[this.id.substring(8)].toBar(false);
					});
				}, aChart.duration + 100);
			}
		});
		cssClass = aChart.mode === 'line' ? 'ui-state-default ui-tabs-selected' : 'ui-state-default';
		$('<li />').html('<a>Lines</a>').addClass(cssClass).appendTo(tabs).click(function () {
			if (aChart.mode === 'groupedbar') {
				aChart.xAxis.fadeOut(function () {
					aChart.xAxis.html('');
				});
			}
			$(this).parent().children('li').removeClass('ui-tabs-selected');
			$(this).addClass('ui-tabs-selected');
			var legends = aChart.legends.removeClass('combination').children('div');
			legends.each(function (index) {
				$(this).children('span.icon')[0].className = 'icon line';
				aChart.series[this.id.substring(8)].toLine(false);
			});
			setTimeout(function () {
				aChart.mode = 'line';
				aChart.print(false);
			}, aChart.duration + 100);
		});
		cssClass = aChart.mode === 'combination' ? 'ui-state-default ui-tabs-selected' : 'ui-state-default';
		$('<li />').html('<a>Combination</a>').addClass(cssClass).appendTo(tabs).click(function () {
			if (aChart.mode === 'groupedbar') {
				aChart.xAxis.fadeOut(function () {
					aChart.xAxis.html('');
				});
			}
			$(this).parent().children('li').removeClass('ui-tabs-selected');
			$(this).addClass('ui-tabs-selected');
			var legends = aChart.legends.addClass('combination').children('div');
			legends.each(function () {
				if ($(this).children('input:first').is(':checked')) {
					$(this).children('span.icon')[0].className = 'icon line';
				}
				else {
					$(this).children('span.icon')[0].className = 'icon bar';
				}
			});

			legends.each(function (index) {
				var id = this.id.substring(8);
				var serie = aChart.series[id];
				if ($(this).children('input:first').is(':checked')) {
					serie.toLine(false);
				}
				else {
					serie.toBar(false);
				}
			});
			setTimeout(function () {
				aChart.mode = 'combination';
				aChart.print(false);
			}, aChart.duration + 100);
		});
	},

	serie: function (label, values, defaultType, mode, visible) {
		this.label = label;
		this.values = values;
		this.defaultType = defaultType;
		this.mode = mode;
		this.visible = visible;

		this.valuelabels = aChart.r.set();
		for (var i = 0; i < values.length; i++) {
			var t = aChart.r.text(0, 0, values[i]);
			var r = aChart.r.rect(0, 0, 10, 10).attr({ 'fill': 'white', 'stroke': 'none' });
			this.valuelabels.push(r).push(t.toFront());
		}
		this.valuelabels.attr({ 'opacity': 0 });

		this.g = aChart.r.path('z').attr({ 'stroke': 'none', 'opacity': 0 });
		this.g.hover(function () {
			if (this.visible) {
				this.valuelabels.attr('opacity', 1).toFront();
			}
		}, function () {
			this.valuelabels.attr('opacity', 0);
		}, this, this);

		this.toLine = function (refreshAll) {
			if (this.mode === 'bar') {
				var groupwidth = aChart.width / this.values.length;
				var path = aChart.getCirclePath(this, groupwidth);
				var serie = this;
				this.g.toFront().animate({
					path: path
				}, aChart.duration, 'ease-in-out', function () {
					serie.g.animate({
						path: aChart.getLinePath(serie, groupwidth)
					}, 0, function () {
						serie.mode = 'line';
						if (refreshAll) {
							aChart.print(false);
						}
					});
				});
			}
		};

		this.toBar = function (refreshAll) {
			if (this.mode === 'line') {
				var groupwidth = aChart.width / this.values.length;
				var path = aChart.getCirclePath(this, groupwidth);
				var serie = this;
				this.g.animate({
					path: path
				}, 0, function () {
					serie.mode = 'bar';
					serie.g.animate({
						path: aChart.getBarPath(serie, groupwidth)
					}, aChart.duration, 'ease-in-out', function () {
						if (refreshAll) {
							aChart.print(false);
						}
					});
				});
			}
		};

		this.refresh = function (duration) {
			var groupwidth = aChart.width / this.values.length;
			var path = '';
			if (this.mode === 'bar') {
				path = aChart.getBarPath(this, groupwidth);
			}
			else if (this.mode === 'line') {
				path = aChart.getLinePath(this, groupwidth);
				this.g.toFront();
			}
			aChart.currentSerie++;
			var index = aChart.currentSerie;
			var tmp = this;
			this.g.animate({
				path: path
			}, duration, 'ease-in-out', function () {
				if (tmp.visible) {
					tmp.g.animate({ 'opacity': 1 }, aChart.duration, 'linear');
					aChart.legends.children('div:nth-child(' + index + ')').fadeIn();
				}
			});

		};
	},

	getCirclePath: function (serie, groupwidth) {
		var path = '';
		var chord = aChart.dotRadius * Math.sqrt(2);
		var bezier = chord * 1.1 / 4;
		var startleft = 0;
		var width = 0;

		if (aChart.mode === 'groupedbar') {
			var legends = aChart.legends.children('div');
			var countSeries = legends.length;
			width = (aChart.width / (countSeries * serie.values.length)) - 2;
			if (width > aChart.maxBarWidth) {
				width = aChart.maxBarWidth;
			}

			groupwidth = aChart.width / countSeries;
			var currentSerie = 0;
			legends.each(function () {
				var index = this.id.substring(8);
				var tmp = aChart.series[index];
				if (tmp === serie) {
					return false;
				}
				currentSerie++;
			});
			startleft = aChart.left + ((groupwidth - (width * serie.values.length)) / 2) + (groupwidth * currentSerie);
		}

		for (var i = 0; i < serie.values.length; i++) {
			var left = 0;
			if (aChart.mode === 'groupedbar') {
				left = startleft + ((i + 0.5) * width) - (0.7 * aChart.dotRadius);
			}
			else {
				left = aChart.left + ((i + 0.5) * groupwidth) - (0.7 * aChart.dotRadius);
			}

			var top = aChart.a * serie.values[i] + aChart.b - (0.7 * aChart.dotRadius);
			path += " M" + left + "," + top + " " +
				"c" + bezier + ",-" + bezier + " " + (chord - bezier) + ",-" + bezier + " " + chord + ",0" +
				"s " + bezier + "," + (chord - bezier) + " 0," + chord +
				"s -" + (chord - bezier) + "," + bezier + " -" + chord + ",0" +
				"s -" + bezier + ",-" + (chord - bezier) + " 0,-" + chord;
		}
		return path;
	},

	getBarPath: function (serie, groupwidth) {
		var path = '';
		var currentSerie = 0;
		var countSeries = 0;
		aChart.legends.children('div').each(function () {
			var index = this.id.substring(8);
			var tmp = aChart.series[index];
			if ($(this).children('span.icon').hasClass('bar')) {
				countSeries++;
				if (tmp === serie) {
					currentSerie = countSeries - 1;
				}
			}
		});

		var width = (aChart.width / (countSeries * serie.values.length)) - 2;
		if (width > aChart.maxBarWidth) {
			width = aChart.maxBarWidth;
		}

		var startleft = 0;
		if (aChart.mode === 'groupedbar') {
			groupwidth = aChart.width / countSeries;
			startleft = aChart.left + ((groupwidth - (width * serie.values.length)) / 2) + (groupwidth * currentSerie);
		}
		else {
			startleft = aChart.left + ((groupwidth - (width * countSeries)) / 2) + (width * currentSerie);
		}

		width -= 1;
		for (var i = 0; i < serie.values.length; i++) {
			var left;
			if (aChart.mode === 'groupedbar') {
				left = startleft + (i * (width + 1));
			}
			else {
				left = startleft + (i * groupwidth);
			}

			var top = aChart.a * serie.values[i] + aChart.b;
			var height = aChart.b - top;
			if (height < 0) {
				height = -height;
				top = top - height;
			}

			if (top + height > aChart.height + aChart.top) {
				height = aChart.height + aChart.top - top;
				if (height <= 0) {
					height = 2;
				}
			}

			var t = serie.valuelabels[(i * 2) + 1];
			t.attr({ 'x': (left + 0.5 * width), 'y': (top - 10) });
			serie.valuelabels[i * 2].attr(t.getBBox());
			path += 'M' + left + ',' + top + ' h' + width + ' v' + height + ' h-' + width + ' v-' + height;
		}
		return path;
	},

	getLinePath: function (serie, groupwidth) {
		var path = '';
		var oldLeft, oldTop;
		var startleft = 0;
		var width = 0;

		if (aChart.mode === 'groupedbar') {
			var legends = aChart.legends.children('div');
			var countSeries = legends.length;
			width = (aChart.width / (countSeries * serie.values.length)) - 2;
			if (width > aChart.maxBarWidth) {
				width = aChart.maxBarWidth;
			}

			groupwidth = aChart.width / countSeries;
			var currentSerie = 0;
			legends.each(function () {
				var index = this.id.substring(8);
				var tmp = aChart.series[index];
				if (tmp === serie) {
					return false;
				}
				currentSerie++;
			});
			startleft = aChart.left + ((groupwidth - (width * serie.values.length)) / 2) + (groupwidth * currentSerie);
		}

		var left = 0;
		var top = 0;
		for (var i = 0; i < serie.values.length; i++) {
			left = 0;
			if (aChart.mode === 'groupedbar') {
				left = startleft + ((i + 0.5) * width);
			}
			else {
				left = aChart.left + ((i + 0.5) * groupwidth);
			}

			top = aChart.a * serie.values[i] + aChart.b;

			var t = serie.valuelabels[(i * 2) + 1];
			t.attr({ 'x': left, 'y': (top - 12) });
			serie.valuelabels[i * 2].attr(t.getBBox());

			path += ' M' + (left - aChart.dotRadius) + ',' + top;
			path += ' a' + aChart.dotRadius + ',' + aChart.dotRadius + ' 0 1,0 0,-1';
			if (i !== 0) {
				var denomiator = Math.sqrt(Math.pow(left - oldLeft, 2) + Math.pow(top - oldTop, 2));
				var leftoffset = (left - oldLeft) * aChart.dotRadius / denomiator;
				var topoffset = (top - oldTop) * aChart.dotRadius / denomiator;
				var y2 = aChart.lineThickness * 0.5 * leftoffset / aChart.dotRadius;
				var x2 = aChart.lineThickness * 0.5 * topoffset / aChart.dotRadius;

				path += ' M' + (left - leftoffset + x2) + ',' + (top - topoffset - y2) +
							' l' + (-x2 * 2) + ',' + (y2 * 2) +
							' L' + (oldLeft + leftoffset - x2) + ',' + (oldTop + topoffset + y2) +
							' l' + (x2 * 2) + ',' + (-y2 * 2) +
							' L' + (left - leftoffset + x2) + ',' + (top - topoffset - y2);
			}
			oldLeft = left;
			oldTop = top;
		}
		path += ' M' + left + ',' + top;
		return path;
	},

	printLegend: function (serie, index, colorIndex, chkbox) {
		var legend = $('<div />')
			.attr('id', 'alegend-' + index)
			.attr('class', 'color-' + colorIndex)
			.appendTo(aChart.legends);

		var iconClass = serie.mode;
		if (aChart.mode === 'line') {
			iconClass = 'line';
		}
		else if (aChart.mode === 'groupedbar') {
			iconClass = 'bar';
		}

		var icon = $('<span />')
			.addClass('icon ' + iconClass)
			.html('&nbsp;')
			.css('background-color', aChart.colors[colorIndex])
			.appendTo(legend);

		var boxLegend = chkbox.parent();
		icon.clone()
		/*.click(function () {
		if (aChart.mode === 'combination') {
		aChart.legends.children('div:nth-child(' + (index + 1) + ')').children('input:not(:checked)').click();
		}
		})*/
		.appendTo(boxLegend);


		boxLegend
			.mouseenter(function () { serie.valuelabels.attr('opacity', 1).toFront(); })
			.mouseleave(function () { serie.valuelabels.attr('opacity', 0); });

		var legendText = $('<span />')
			.html(serie.label)
		/*.mouseenter(function () { serie.valuelabels.attr('opacity', 1).toFront(); })
		.mouseleave(function () { serie.valuelabels.attr('opacity', 0); })*/
			.appendTo(legend);

		var radio = $('<input type="radio" name="radio-' + colorIndex + '" />')
			.attr('checked', (serie.mode === 'line'))
			.appendTo(legend)
			.click(function () {
				$(this).parent().children('span.icon').removeClass('bar').addClass('line');
				serie.toLine(true);
			});

		radio = $('<input type="radio" name="radio-' + colorIndex + '" />')
			.attr('checked', (serie.mode === 'bar'))
			.appendTo(legend)
			.click(function () {
				$(this).parent().children('span.icon').removeClass('line').addClass('bar');
				serie.toBar(true);
			});

		serie.g.attr({ 'fill': aChart.colors[colorIndex] });
	},

	print: function (skipTransition) {
		aChart.currentSerie = 0;
		var duration = aChart.duration;
		if (skipTransition) {
			duration = 0;
		}

		aChart.legends.children('div').each(function () {
			var index = this.id.substring(8);
			var tmp = aChart.series[index];
			tmp.refresh(duration);
		});

		// print x-axis
		setTimeout(function () {
			if (aChart.xAxis.children('div').length === 0) {
				var width = 0;
				if (aChart.mode === 'groupedbar') {
					var legends = aChart.legends.children('div');
					width = (aChart.width / legends.length);
					legends.each(function () {
						var html = $(this).children('span:not(.icon)').html();
						$('<div />')
							.html(html)
							.width(width)
							.appendTo(aChart.xAxis);
					});
					aChart.xAxis.fadeIn();
				}
				else {
					width = (aChart.width / aChart.years.length);
					for (var i = 0; i < aChart.years.length; i++) {
						$('<div />')
							.html(aChart.years[i])
							.width(width)
							.appendTo(aChart.xAxis);
					}
					aChart.xAxis.fadeIn();
				}
			}
		}, aChart.duration);
	},

	populateTogglePanel: function (chart) {
		var togglePanel = $('<div />').attr('id', 'togglePanel').appendTo(chart).click(function () {
			//$(this).children('div.dropdown').height(100).slideDown();
		}).mouseleave(function () {
			//$(this).children('div.dropdown').slideUp();
		});
		var dropdown = $('<div />').addClass('dropdown').appendTo(togglePanel);
		//$('<span />').html('Select data series').appendTo(togglePanel);
		var colorIndex = 0;
		var change = function () {
			var index = parseInt(this.id.substring(11), 10);
			if ($(this).is(':checked')) {
				aChart.series[index].visible = true;

				// find suitable color index
				var tmpColorIndex = 0;
				for (var i = 0; i < aChart.colors.length; i++) {
					if (aChart.legends.children('div.color-' + i).length === 0) {
						tmpColorIndex = i;
						break;
					}
				}
				aChart.printLegend(aChart.series[index], index, tmpColorIndex, $(this));
				if (aChart.mode === 'line') {
					aChart.series[index].mode = 'line';
				}
				else if (aChart.mode === 'groupedbar') {
					aChart.series[index].mode = 'bar';
					var width = (aChart.width / aChart.legends.children('div').length);
					aChart.xAxis.children('div').animate({ width: width }, aChart.duration);
					$('<div />')
								.html(aChart.series[index].label)
								.width(width)
								.appendTo(aChart.xAxis)
								.hide()
								.delay(aChart.duration)
								.fadeIn();
				}
			}
			else {
				aChart.series[index].valuelabels.attr('opacity', 0);
				$(this).parent()
					.unbind('mouseenter')
					.unbind('mouseleave')
					.children('span.icon').remove();

				aChart.legends.children('div#alegend-' + index).remove();
				aChart.series[index].visible = false;
				aChart.series[index].g.attr('opacity', 0);

				if (aChart.mode === 'groupedbar') {
					aChart.xAxis.html('');
				}
			}
			aChart.drawYAxis();
			var skipTransition = !(aChart.scaleChange || aChart.series[index].mode === 'bar');
			aChart.print(skipTransition);
		};
		for (var i = 0; i < aChart.series.length; i++) {
			var serie = aChart.series[i];
			var div = $('<div />').appendTo(dropdown);
			var chkbox = $('<input type="checkbox" />')
				.attr('id', 'achart-chk-' + i)
				.appendTo(div)
				.change(change);
			if (serie.visible) {
				chkbox.attr('checked', 'checked');
				aChart.printLegend(serie, i, colorIndex++, chkbox);
			}

			var label = $('<label />')
				.attr('for', 'achart-chk-' + i)
				.html(serie.label)
				.appendTo(div);
		}
	},

	initData: function (chart) {
		var table = chart.children('table');
		table.children('thead').children('tr:last').children('th:not(:first)').each(function () {
			aChart.years.push($(this).html());
		});
		table.children('tbody').children('tr').each(function () {
			var tr = $(this);
			var values = [];
			tr.children('td').each(function () {
				var v = parseFloat($(this).text().replace(',', '.'));
				values.push(v);
			});
			var mode;
			if (aChart.mode === 'combination') {
				if (tr.hasClass('bar')) {
					mode = 'bar';
				}
				else {
					mode = 'line';
				}
			}
			else {
				mode = aChart.mode;
			}
			aChart.series.push(new aChart.serie(tr.children('th').html(), values, 'bar', mode, (tr.hasClass('visible'))));
		});
	},

	drawYAxis: function () {
		// set min and max values
		aChart.currentSerie = 0;
		var max = -10000;
		var min = 10000;
		for (var i = 0; i < aChart.series.length; i++) {
			var tmp = aChart.series[i];
			if (tmp.visible) {
				for (var j = 0; j < aChart.series[i].values.length; j++) {
					var v = aChart.series[i].values[j];
					if (v > max) {
						max = v;
					}
					if (v < min) {
						min = v;
					}
				}
			}
		}

		if (min > 0 && aChart.showZero) {
			min = 0;
		}

		var range = max - min;
		var exponent = Math.floor(Math.log(range) / Math.LN10);
		var decimalFormat = 1 / (Math.pow(10, exponent - 1));

		var fraction = range / Math.pow(10, exponent);
		var stepsize;
		if (fraction <= 1) {
			stepsize = 1;
		}
		else if (fraction <= 2) {
			stepsize = 2;
		}
		else if (fraction <= 5) {
			stepsize = 5;
		}
		else {
			stepsize = 10;
		}

		stepsize = (stepsize * Math.pow(10, exponent)) / 10;

		max = stepsize * Math.ceil(max / stepsize);
		min = stepsize * Math.floor(min / stepsize);

		var x1 = max;
		var x2 = min;
		var y1 = aChart.top;
		var y2 = aChart.height + aChart.top;

		aChart.b = (y2 - y1 * x2 / x1) / (1 - x2 / x1);
		aChart.a = (y1 - aChart.b) / x1;

		var stepCount = 0;

		for (var i = 0; max - ((i - 1) * stepsize) > min; i++) {
			stepCount++;
		}

		var linecolor;
		var yAxis = aChart.r.set();

		for (var i = 0; i < stepCount; i++) {
			var val = max - (i * stepsize);
			val = Math.round(val * decimalFormat) / decimalFormat;
			var top = parseInt(aChart.a * val + aChart.b, 10) + 0.5; // add 0.5 to make the lines sharp
			yAxis.push(aChart.r.text(aChart.left - 5, top, val).data("val", val)).attr({
				'text-anchor': 'end',
				'width': aChart.left
			});
			if (val === 0) {
				linecolor = 'black';
			}
			else {
				linecolor = '#cccccc';
			}

			yAxis.push(aChart.r.path("M" + aChart.left + "," + top + "h" + aChart.width).attr({ 'stroke': linecolor }).data("val", val).toBack());
		}

		if (aChart.yAxis !== null) {
			// calculate the previous scale and offset according to the linear function y = ax + b
			x1 = aChart.yAxis[0].data('val');
			x2 = aChart.yAxis[aChart.yAxis.length - 1].data('val');
			y1 = aChart.top;
			y2 = aChart.height + aChart.top;

			var b = (y2 - y1 * x2 / x1) / (1 - x2 / x1);
			var a = (y1 - b) / x1;

			aChart.scaleChange = ((aChart.a !== a) || (aChart.b !== b));

			yAxis.forEach(function (object) {
				var x = object.data('val');
				var y = a * x + b;
				var box = object.getBBox();
				y -= (box.y + box.height / 2);
				object.transform('t0,' + y); // adjust the current lines to the previous scale ...
				object.attr({ 'opacity': 0 });
				object.animate({
					'transform': 't0,0', // ... and animate them to the correct position
					'opacity': 1
				}, aChart.duration, 'ease-in-out');
			});

			// --------- fade out the previous axis

			aChart.yAxis.forEach(function (object) {
				var x = object.data('val');
				var y = aChart.a * x + aChart.b;
				var box = object.getBBox();
				y -= (box.y + box.height / 2);
				object.animate({
					'transform': 't0,' + y,
					'opacity': 0
				}, aChart.duration, 'ease-in-out', function () {
					this.remove();
				});
			});
			aChart.yAxis.clear();
		}
		aChart.yAxis = yAxis;
	}
};

/* =========================================== Flexslider =========================================== */
/*
* jQuery FlexSlider v1.8
* http://flex.madebymufffin.com
*
* Copyright 2011, Tyler Smith
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*
* Contrib: Darin Richardson
*/

; (function ($) {

	//FlexSlider: Object Instance
	$.flexslider = function (el, options) {
		var slider = el;



		slider.init = function () {
			slider.vars = $.extend({}, $.flexslider.defaults, options);
			slider.data('flexslider', true);
			slider.container = $('.slides', slider);
			slider.slides = $('.slides > li', slider);
			slider.count = slider.slides.length;
			slider.animating = false;
			slider.currentSlide = slider.vars.slideToStart;
			slider.animatingTo = slider.currentSlide;
			slider.atEnd = (slider.currentSlide === 0) ? true : false;
			slider.eventType = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
			slider.cloneCount = 0;
			slider.cloneOffset = 0;
			slider.manualPause = false;
			slider.vertical = (slider.vars.slideDirection === "vertical");
			slider.prop = (slider.vertical) ? "top" : "marginLeft";
			slider.args = {};

			//Test for webbkit CSS3 Animations
			slider.transitions = "webkitTransition" in document.body.style;
			if (slider.transitions) { slider.prop = "-webkit-transform"; }

			//Test for controlsContainer
			if (slider.vars.controlsContainer !== "") {
				slider.controlsContainer = $(slider.vars.controlsContainer).eq($('.slides').index(slider.container));
				slider.containerExists = slider.controlsContainer.length > 0;
			}
			//Test for manualControls
			if (slider.vars.manualControls !== "") {
				slider.manualControls = $(slider.vars.manualControls, ((slider.containerExists) ? slider.controlsContainer : slider));
				slider.manualExists = slider.manualControls.length > 0;
			}

			///////////////////////////////////////////////////////////////////
			// FlexSlider: Randomize Slides
			if (slider.vars.randomize) {
				slider.slides.sort(function () { return (Math.round(Math.random()) - 0.5); });
				slider.container.empty().append(slider.slides);
			}
			///////////////////////////////////////////////////////////////////

			///////////////////////////////////////////////////////////////////
			// FlexSlider: Slider Animation Initialize
			if (slider.vars.animation.toLowerCase() === "slide") {
				if (slider.transitions) {
					slider.setTransition(0);
				}
				slider.css({ "overflow": "hidden" });
				if (slider.vars.animationLoop) {
					slider.cloneCount = 2;
					slider.cloneOffset = 1;
					slider.container.append(slider.slides.filter(':first').clone().addClass('clone')).prepend(slider.slides.filter(':last').clone().addClass('clone'));
				}
				//create newSlides to capture possible clones
				slider.newSlides = $('.slides > li', slider);
				var sliderOffset = (-1 * (slider.currentSlide + slider.cloneOffset));
				if (slider.vertical) {
					slider.newSlides.css({ "display": "block", "width": "100%", "float": "left" });
					slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
					//Timeout function to give browser enough time to get proper height initially
					setTimeout(function () {
						slider.css({ "position": "relative" }).height(slider.slides.filter(':first').height());
						slider.args[slider.prop] = (slider.transitions) ? "translate3d(0," + sliderOffset * slider.height() + "px,0)" : sliderOffset * slider.height() + "px";
						slider.container.css(slider.args);
					}, 100);

				} else {
					slider.args[slider.prop] = (slider.transitions) ? "translate3d(" + sliderOffset * slider.width() + "px,0,0)" : sliderOffset * slider.width() + "px";
					slider.container.width((slider.count + slider.cloneCount) * 200 + "%").css(slider.args);
					//Timeout function to give browser enough time to get proper width initially
					setTimeout(function () {
						slider.newSlides.width(slider.width()).css({ "float": "left", "display": "block" });
					}, 100);
				}

			} else { //Default to fade
				//Not supporting fade CSS3 transitions right now
				slider.transitions = false;
				slider.slides.css({ "width": "100%", "float": "left", "marginRight": "-100%" }).eq(slider.currentSlide).fadeIn(slider.vars.animationDuration);
			}
			///////////////////////////////////////////////////////////////////

			///////////////////////////////////////////////////////////////////
			// FlexSlider: Control Nav
			if (slider.vars.controlNav) {
				if (slider.manualExists) {
					slider.controlNav = slider.manualControls;
				} else {
					var controlNavScaffold = $('<ol class="flex-control-nav"></ol>');
					var j = 1;
					for (var i = 0; i < slider.count; i++) {
						controlNavScaffold.append('<li><a>' + j + '</a></li>');
						j++;
					}

					if (slider.containerExists) {
						$(slider.controlsContainer).append(controlNavScaffold);
						slider.controlNav = $('.flex-control-nav li a', slider.controlsContainer);
					} else {
						slider.append(controlNavScaffold);
						slider.controlNav = $('.flex-control-nav li a', slider);
					}
				}

				slider.controlNav.eq(slider.currentSlide).addClass('active');

				slider.controlNav.bind(slider.eventType, function (event) {
					event.preventDefault();
					if (!$(this).hasClass('active')) {
						(slider.controlNav.index($(this)) > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
						slider.flexAnimate(slider.controlNav.index($(this)), slider.vars.pauseOnAction);
					}
				});
			}
			///////////////////////////////////////////////////////////////////

			//////////////////////////////////////////////////////////////////
			//FlexSlider: Direction Nav
			if (slider.vars.directionNav) {
				var directionNavScaffold = $('<ul class="flex-direction-nav"><li><a class="prev" href="#">' + slider.vars.prevText + '</a></li><li><a class="next" href="#">' + slider.vars.nextText + '</a></li></ul>');

				if (slider.containerExists) {
					$(slider.controlsContainer).append(directionNavScaffold);
					slider.directionNav = $('.flex-direction-nav li a', slider.controlsContainer);
				} else {
					slider.append(directionNavScaffold);
					slider.directionNav = $('.flex-direction-nav li a', slider);
				}

				//Set initial disable styles if necessary
				if (!slider.vars.animationLoop) {
					if (slider.currentSlide === 0) {
						slider.directionNav.filter('.prev').addClass('disabled');
					} else if (slider.currentSlide === slider.count - 1) {
						slider.directionNav.filter('.next').addClass('disabled');
					}
				}

				slider.directionNav.bind(slider.eventType, function (event) {
					event.preventDefault();
					var target = ($(this).hasClass('next')) ? slider.getTarget('next') : slider.getTarget('prev');

					if (slider.canAdvance(target)) {
						slider.flexAnimate(target, slider.vars.pauseOnAction);
					}
				});
			}
			//////////////////////////////////////////////////////////////////

			//////////////////////////////////////////////////////////////////
			//FlexSlider: Keyboard Nav
			if (slider.vars.keyboardNav && $('ul.slides').length === 1) {
				function keyboardMove(event) {
					if (slider.animating) {
						return;
					} else if (event.keyCode !== 39 && event.keyCode !== 37) {
						return;
					} else {
						if (event.keyCode === 39) {
							var target = slider.getTarget('next');
						} else if (event.keyCode === 37) {
							var target = slider.getTarget('prev');
						}

						if (slider.canAdvance(target)) {
							slider.flexAnimate(target, slider.vars.pauseOnAction);
						}
					}
				}
				$(document).bind('keyup', keyboardMove);
			}
			//////////////////////////////////////////////////////////////////

			///////////////////////////////////////////////////////////////////
			// FlexSlider: Mousewheel interaction
			if (slider.vars.mousewheel) {
				slider.mousewheelEvent = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
				slider.bind(slider.mousewheelEvent, function (e) {
					e.preventDefault();
					e = e ? e : window.event;
					var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40,
              target = (wheelData < 0) ? slider.getTarget('next') : slider.getTarget('prev');

					if (slider.canAdvance(target)) {
						slider.flexAnimate(target, slider.vars.pauseOnAction);
					}
				});
			}
			///////////////////////////////////////////////////////////////////

			//////////////////////////////////////////////////////////////////
			//FlexSlider: Slideshow Setup
			if (slider.vars.slideshow) {
				//pauseOnHover
				if (slider.vars.pauseOnHover && slider.vars.slideshow) {
					slider.hover(function () {
						slider.pause();
					}, function () {
						if (!slider.manualPause) {
							slider.resume();
						}
					});
				}

				//Initialize animation
				slider.animatedSlides = setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
			}
			//////////////////////////////////////////////////////////////////

			//////////////////////////////////////////////////////////////////
			//FlexSlider: Pause/Play
			if (slider.vars.pausePlay) {
				var pausePlayScaffold = $('<div class="flex-pauseplay"><span></span></div>');

				if (slider.containerExists) {
					slider.controlsContainer.append(pausePlayScaffold);
					slider.pausePlay = $('.flex-pauseplay span', slider.controlsContainer);
				} else {
					slider.append(pausePlayScaffold);
					slider.pausePlay = $('.flex-pauseplay span', slider);
				}

				var pausePlayState = (slider.vars.slideshow) ? 'pause' : 'play';
				slider.pausePlay.addClass(pausePlayState).text((pausePlayState === 'pause') ? slider.vars.pauseText : slider.vars.playText);

				slider.pausePlay.bind(slider.eventType, function (event) {
					event.preventDefault();
					if ($(this).hasClass('pause')) {
						slider.pause();
						slider.manualPause = true;
					} else {
						slider.resume();
						slider.manualPause = false;
					}
				});
			}
			//////////////////////////////////////////////////////////////////

			//////////////////////////////////////////////////////////////////
			//FlexSlider:Touch Swip Gestures
			//Some brilliant concepts adapted from the following sources
			//Source: TouchSwipe - http://www.netcu.de/jquery-touchwipe-iphone-ipad-library
			//Source: SwipeJS - http://swipejs.com
			if ('ontouchstart' in document.documentElement) {
				//For brevity, variables are named for x-axis scrolling
				//The variables are then swapped if vertical sliding is applied
				//This reduces redundant code...I think :)
				//If debugging, recognize variables are named for horizontal scrolling
				var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          scrolling = false;

				slider.each(function () {
					if ('ontouchstart' in document.documentElement) {
						this.addEventListener('touchstart', onTouchStart, false);
					}
				});

				function onTouchStart(e) {
					if (slider.animating) {
						e.preventDefault();
					} else if (e.touches.length === 1) {
						slider.pause();
						cwidth = (slider.vertical) ? slider.height() : slider.width();
						startT = Number(new Date());
						offset = (slider.vertical) ? (slider.currentSlide + slider.cloneOffset) * slider.height() : (slider.currentSlide + slider.cloneOffset) * slider.width();
						startX = (slider.vertical) ? e.touches[0].pageY : e.touches[0].pageX;
						startY = (slider.vertical) ? e.touches[0].pageX : e.touches[0].pageY;
						slider.setTransition(0);

						this.addEventListener('touchmove', onTouchMove, false);
						this.addEventListener('touchend', onTouchEnd, false);
					}
				}

				function onTouchMove(e) {
					dx = (slider.vertical) ? startX - e.touches[0].pageY : startX - e.touches[0].pageX;
					scrolling = (slider.vertical) ? (Math.abs(dx) < Math.abs(e.touches[0].pageX - startY)) : (Math.abs(dx) < Math.abs(e.touches[0].pageY - startY));

					if (!scrolling) {
						e.preventDefault();
						if (slider.vars.animation === "slide" && slider.transitions) {
							if (!slider.vars.animationLoop) {
								dx = dx / ((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.count - 1 && dx > 0) ? (Math.abs(dx) / cwidth + 2) : 1);
							}
							slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + (-offset - dx) + "px,0)" : "translate3d(" + (-offset - dx) + "px,0,0)";
							slider.container.css(slider.args);
						}
					}
				}

				function onTouchEnd(e) {
					slider.animating = false;
					if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
						var target = (dx > 0) ? slider.getTarget('next') : slider.getTarget('prev');
						if (slider.canAdvance(target) && Number(new Date()) - startT < 550 && Math.abs(dx) > 20 || Math.abs(dx) > cwidth / 2) {
							slider.flexAnimate(target, slider.vars.pauseOnAction);
						} else {
							slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction);
						}
					}

					//Finish the touch by undoing the touch session
					this.removeEventListener('touchmove', onTouchMove, false);
					this.removeEventListener('touchend', onTouchEnd, false);
					startX = null;
					startY = null;
					dx = null;
					offset = null;
				}
			}
			//////////////////////////////////////////////////////////////////

			//////////////////////////////////////////////////////////////////
			//FlexSlider: Resize Functions (If necessary)
			if (slider.vars.animation.toLowerCase() === "slide") {
				$(window).resize(function () {
					if (!slider.animating) {
						if (slider.vertical) {
							slider.height(slider.slides.filter(':first').height());
							slider.args[slider.prop] = (-1 * (slider.currentSlide + slider.cloneOffset)) * slider.slides.filter(':first').height() + "px";
							if (slider.transitions) {
								slider.setTransition(0);
								slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.args[slider.prop] + ",0)" : "translate3d(" + slider.args[slider.prop] + ",0,0)";
							}
							slider.container.css(slider.args);
						} else {
							slider.newSlides.width(slider.width());
							slider.args[slider.prop] = (-1 * (slider.currentSlide + slider.cloneOffset)) * slider.width() + "px";
							if (slider.transitions) {
								slider.setTransition(0);
								slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.args[slider.prop] + ",0)" : "translate3d(" + slider.args[slider.prop] + ",0,0)";
							}
							slider.container.css(slider.args);
						}
					}
				});
			}
			//////////////////////////////////////////////////////////////////

			//////////////////////////////////////////////////////////////////
			//FlexSlider: Destroy the slider entity
			//Destory is not included in the minified version right now, but this is a working function for anyone who wants to include it.
			//Simply bind the actions you need from this function into a function in the start() callback to the event of your chosing
			/*
			slider.destroy = function() {
			slider.pause();
			if (slider.controlNav && slider.vars.manualControls === "") slider.controlNav.closest('.flex-control-nav').remove();
			if (slider.directionNav) slider.directionNav.closest('.flex-direction-nav').remove();
			if (slider.vars.pausePlay) slider.pausePlay.closest('.flex-pauseplay').remove();
			if (slider.vars.keyboardNav && $('ul.slides').length === 1) $(document).unbind('keyup', keyboardMove);
			if (slider.vars.mousewheel) slider.unbind(slider.mousewheelEvent);
			if (slider.transitions) slider.each(function(){this.removeEventListener('touchstart', onTouchStart, false);});
			if (slider.vars.animation === "slide" && slider.vars.animationLoop) slider.newSlides.filter('.clone').remove();
			if (slider.vertical) slider.height("auto");
			slider.slides.hide();
			slider.removeData('flexslider');
			}
			*/
			//////////////////////////////////////////////////////////////////

			//FlexSlider: start() Callback
			slider.vars.start(slider);
		};

		//FlexSlider: Animation Actions
		slider.flexAnimate = function (target, pause) {
			if (!slider.animating) {
				//Animating flag
				slider.animating = true;

				//FlexSlider: before() animation Callback
				slider.animatingTo = target;
				slider.vars.before(slider);

				//Optional paramter to pause slider when making an anmiation call
				if (pause) {
					slider.pause();
				}

				//Update controlNav   
				if (slider.vars.controlNav) {
					slider.controlNav.removeClass('active').eq(target).addClass('active');
				}

				//Update billerud specific bottom labels
				labels.removeClass('active').eq(target).addClass('active');

				//Is the slider at either end
				slider.atEnd = (target === 0 || target === slider.count - 1) ? true : false;
				if (!slider.vars.animationLoop && slider.vars.directionNav) {
					if (target === 0) {
						slider.directionNav.removeClass('disabled').filter('.prev').addClass('disabled');
					} else if (target === slider.count - 1) {
						slider.directionNav.removeClass('disabled').filter('.next').addClass('disabled');
					} else {
						slider.directionNav.removeClass('disabled');
					}
				}

				if (!slider.vars.animationLoop && target === slider.count - 1) {
					slider.pause();
					//FlexSlider: end() of cycle Callback
					slider.vars.end(slider);
				}

				if (slider.vars.animation.toLowerCase() === "slide") {
					var dimension = (slider.vertical) ? slider.slides.filter(':first').height() : slider.slides.filter(':first').width();

					if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
						slider.slideString = "0px";
					} else if (slider.currentSlide === slider.count - 1 && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
						slider.slideString = (-1 * (slider.count + 1)) * dimension + "px";
					} else {
						slider.slideString = (-1 * (target + slider.cloneOffset)) * dimension + "px";
					}
					slider.args[slider.prop] = slider.slideString;

					if (slider.transitions) {
						slider.setTransition(slider.vars.animationDuration);
						slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.slideString + ",0)" : "translate3d(" + slider.slideString + ",0,0)";
						slider.container.css(slider.args).one("webkitTransitionEnd transitionend", function () {
							slider.wrapup(dimension);
						});
					} else {
						slider.container.animate(slider.args, slider.vars.animationDuration, function () {
							slider.wrapup(dimension);
						});
					}
				} else { //Default to Fade
					slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationDuration);
					slider.slides.eq(target).fadeIn(slider.vars.animationDuration, function () {
						slider.wrapup();
					});
				}
			}
		};

		//FlexSlider: Function to minify redundant animation actions
		slider.wrapup = function (dimension) {
			if (slider.vars.animation === "slide") {
				//Jump the slider if necessary
				if (slider.currentSlide === 0 && slider.animatingTo === slider.count - 1 && slider.vars.animationLoop) {
					slider.args[slider.prop] = (-1 * slider.count) * dimension + "px";
					if (slider.transitions) {
						slider.setTransition(0);
						slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.args[slider.prop] + ",0)" : "translate3d(" + slider.args[slider.prop] + ",0,0)";
					}
					slider.container.css(slider.args);
				} else if (slider.currentSlide === slider.count - 1 && slider.animatingTo === 0 && slider.vars.animationLoop) {
					slider.args[slider.prop] = -1 * dimension + "px";
					if (slider.transitions) {
						slider.setTransition(0);
						slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.args[slider.prop] + ",0)" : "translate3d(" + slider.args[slider.prop] + ",0,0)";
					}
					slider.container.css(slider.args);
				}
			}
			slider.animating = false;
			slider.currentSlide = slider.animatingTo;
			//FlexSlider: after() animation Callback
			slider.vars.after(slider);
		};

		//FlexSlider: Automatic Slideshow
		slider.animateSlides = function () {
			if (!slider.animating) {
				slider.flexAnimate(slider.getTarget("next"));
			}
		};

		//FlexSlider: Automatic Slideshow Pause
		slider.pause = function () {
			clearInterval(slider.animatedSlides);
			if (slider.vars.pausePlay) {
				slider.pausePlay.removeClass('pause').addClass('play').text(slider.vars.playText);
			}
		};

		//FlexSlider: Automatic Slideshow Start/Resume
		slider.resume = function () {
			slider.animatedSlides = setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
			if (slider.vars.pausePlay) {
				slider.pausePlay.removeClass('play').addClass('pause').text(slider.vars.pauseText);
			}
		};

		//FlexSlider: Helper function for non-looping sliders
		slider.canAdvance = function (target) {
			if (!slider.vars.animationLoop && slider.atEnd) {
				if (slider.currentSlide === 0 && target === slider.count - 1 && slider.direction !== "next") {
					return false;
				} else if (slider.currentSlide === slider.count - 1 && target === 0 && slider.direction === "next") {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		};

		//FlexSlider: Helper function to determine animation target
		slider.getTarget = function (dir) {
			slider.direction = dir;
			if (dir === "next") {
				return (slider.currentSlide === slider.count - 1) ? 0 : slider.currentSlide + 1;
			} else {
				return (slider.currentSlide === 0) ? slider.count - 1 : slider.currentSlide - 1;
			}
		}

		//FlexSlider: Helper function to set CSS3 transitions
		slider.setTransition = function (dur) {
			slider.container.css({ '-webkit-transition-duration': (dur / 1000) + "s" });
		}

		//FlexSlider: Initialize
		slider.init();

		/* Custom for Billerud below... */
		var labels = slider.container.children('li').children('h2').wrapInner('<span />');
		labels.first().addClass('active');
		var labelcontainer = $('<div class="labelcontainer" />').appendTo(slider);
		labels.css('width', (100 / labels.length) + '%').appendTo(labelcontainer).click(function () {
			slider.flexAnimate($(this).index('h2'), slider.vars.pauseOnAction);
		});

		// if the tag "data-videotopoffset" is defined, the image should be replaced with a video on click
		slider.find('img[data-videotopoffset]').each(function () {
			var img = $(this);
			var videocontainer = $('<span class="videocontainer" />');
			img.wrap(videocontainer);

			var src = img.attr('src');
			src = src.substring(0, src.length - 4);
			var imgName = src.substring(src.lastIndexOf('/') + 1);
			var video = $('<video id="video_' + imgName + '" class="video-js" preload="auto" width="1176" height="661"><source src="/UI/video/' + imgName + '.mp4" type="video/mp4" /></video>');

			video.insertAfter(img).hide();
			video.bind('canplaythrough', function() {
				$('<span class="playvideo" data-video-id="' + imgName + '" />').insertAfter(img).click(function() {
					$(this).hide();
					img.parent().next().fadeOut(1000);
					var closeBtn = video.siblings('a.close').show();
					var origHeight = img.height();
					img.hide();
					var topOffset = -1 * parseInt(img.attr('data-videotopoffset'));
					video
						.css('margin-top', topOffset)
						.height(origHeight - topOffset)
						.show()
						.animate({ 'margin-top': 0, 'height': 661 }, 400, function () {
							video[0].play();
						});
				});
			});
			
			$('<a class="close">Close</a>').click(function () {
					var btn = $(this);
					var span = btn.hide().parent();
					var img = span.children('img').show();
					img.parent().next().fadeIn('fast');
					img.parent().children('span.playvideo').show();
					video[0].pause();
					video.hide();

				})
				.insertAfter(img);
		});

		// if the slider is higher than the window, make the slider labels fixed to the bottom of the window
		var flexsliderfixed = function () {
			if ($(window).height() + $(window).scrollTop() < slider.offset().top + labelcontainer.height() + slider.height()) {
				$('html').addClass('flexsliderfixed');
				labelcontainer.css('width', slider.width());
			}
			else {
				$('html').removeClass('flexsliderfixed');
				labelcontainer.css('width', '');
			}
		};
		$(window).scroll(flexsliderfixed).resize(flexsliderfixed);
		flexsliderfixed();

	}

	//FlexSlider: Default Settings
	$.flexslider.defaults = {
		animation: "slide",              //String: Select your animation type, "fade" or "slide"
		slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"
		slideshow: true,                //Boolean: Animate slider automatically
		slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
		animationDuration: 600,         //Integer: Set the speed of animations, in milliseconds
		directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
		controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
		keyboardNav: true,              //Boolean: Allow slider navigating via keyboard left/right keys
		mousewheel: false,              //Boolean: Allow slider navigating via mousewheel
		prevText: "Previous",           //String: Set the text for the "previous" directionNav item
		nextText: "Next",               //String: Set the text for the "next" directionNav item
		pausePlay: false,               //Boolean: Create pause/play dynamic element
		pauseText: 'Pause',             //String: Set the text for the "pause" pausePlay item
		playText: 'Play',               //String: Set the text for the "play" pausePlay item
		randomize: false,               //Boolean: Randomize slide order
		slideToStart: 0,                //Integer: The slide that the slider should start on. Array notation (0 = first slide)
		animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
		pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
		pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
		controlsContainer: "",          //Selector: Declare which container the navigation elements should be appended too. Default container is the flexSlider element. Example use would be ".flexslider-container", "#container", etc. If the given element is not found, the default action will be taken.
		manualControls: "",             //Selector: Declare custom control navigation. Example would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
		start: function () { },            //Callback: function(slider) - Fires when the slider loads the first slide
		before: function () { },           //Callback: function(slider) - Fires asynchronously with each slider animation
		after: function () { },            //Callback: function(slider) - Fires after each slider animation completes
		end: function () { }               //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
	}

	//FlexSlider: Plugin Function
	$.fn.flexslider = function (options) {
		return this.each(function () {
			if ($(this).find('.slides li').length === 1) {
				$(this).find('.slides li').fadeIn(400);
			}
			else if ($(this).data('flexslider') !== true) {
				new $.flexslider($(this), options);
			}
		});
	}

})(jQuery);

/* ====================== Plugin: Highlight ===================================== */

jQuery.fn.highlight = function (pat) {
	function innerHighlight(node, pat) {
		var skip = 0;
		if (node.nodeType == 3) {
			var pos = node.data.toUpperCase().indexOf(pat);
			if (pos >= 0) {
				var spannode = document.createElement('span');
				spannode.className = 'highlight';
				var middlebit = node.splitText(pos);
				var endbit = middlebit.splitText(pat.length);
				var middleclone = middlebit.cloneNode(true);
				spannode.appendChild(middleclone);
				middlebit.parentNode.replaceChild(spannode, middlebit);
				skip = 1;
			}
		}
		else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
			for (var i = 0; i < node.childNodes.length; ++i) {
				i += innerHighlight(node.childNodes[i], pat);
			}
		}
		return skip;
	}
	return this.each(function () {
		innerHighlight(this, pat.toUpperCase());
	});
};

jQuery.fn.removeHighlight = function () {
	return this.find("span.highlight").each(function () {
		this.parentNode.firstChild.nodeName;
		with (this.parentNode) {
			replaceChild(this.firstChild, this);
			normalize();
		}
	}).end();
};

/* ====================== Plugin: QueryString ===================================== */
(function ($) {
	$.QueryString = (function (a) {
		if (a == "") return {};
		var b = {};
		for (var i = 0; i < a.length; ++i) {
			var p = a[i].split('=');
			if (p.length != 2) continue;
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return b;
	})(window.location.search.substr(1).split('&'))
})(jQuery);


var Newsroom = {
	init: function () {
		var items = $('#newstimeline').children('ol').children('li');
		var showmore = items.filter('li.showmore');
		items = items.filter(':not(li.showmore)');
		if (items.length > 0) {
			var prevLeftbottom = 100000;
			var leftPos = items.first().position().left;

			// the lineup function simulates the facebook timeline look, where the news items is put on the left- and right-hand side of a central axis
			var lineup = function (items) {
				if ($(document).width() <= 600) {
					return;
				}
				items.each(function () {
					var li = $(this);
					prevLeftbottom = li.position().top + li.height();
					if (li.hasClass('year')) {

					}
					else {
						var pointer = $('<span class="pointer"></span>');
						if (li.position().left === leftPos) {
							// this one is to the left
							if (li.hasClass('majoritem')) {
								pointer.addClass('toppointer');
							}
							else {
								pointer.addClass('rightpointer');
								// move it upwards if there is space
								if (li.position().top > prevLeftbottom) {
									var marginTop = li.position().top - prevLeftbottom - 20;
									if (marginTop > (li.height() - 20)) {
										marginTop = li.height() - 20;
									}
									li.css('margin-top', -marginTop);
									pointer.css('top', marginTop + 20);
									prevLeftbottom = li.position().top + li.height() - marginTop;
								}
							}
						}
						else { // this one is to the right
							li.css('float', 'right');
							pointer.addClass('leftpointer');
						}
						li.append(pointer);
					}
				});
			};

			lineup(items);

			var showmoreclick = function (event) {
				event.preventDefault();
				showmore = $(this);
				var href = showmore.children('a').attr('href');
				var url = document.location.href;
				url = url.substring(0, url.lastIndexOf('/') + 1) + href;
				showmore.html('<a>Loading...</a>');
				$.get(url, function (data) {
					var ol = items.parent();
					items = $(data).find('#newstimeline').children('ol').children('li');

					if (showmore.is(':not(:last-child)')) {
						// remove any item that has already been printed below via the left-hand shortcuts
						var printedyear = parseInt(showmore.nextAll('li.year').first().find('h3').html());
						var removeMe = items.first().hasClass('y' + printedyear);
						items.each(function () {
							if (removeMe) {
								$(this).addClass('removeMe');
							}
							else {
								removeMe = $(this).hasClass('y' + printedyear);
								if (removeMe) {
									$(this).addClass('removeMe');
								}
							}
						});
						items = items.filter(':not(li.removeMe)');
					}

					showmore.before(items.hide().fadeIn('slow'));
					showmore.hide();

					// if this was a click genererated from the left-hand timeline navigation - scroll down to the selected year
					if (showmore.hasClass('yearspecific')) {
						$('html,body').animate({
							scrollTop: items.first().offset().top - 10
						}, 500);
					}

					showmore = items.filter('li.showmore');
					items = items.filter(':not(li.showmore)');
					yearbox = $('#newstimeline').children('ol').children('li.year');
					showmore.click(showmoreclick);
					lineup(items);
				});
			};

			showmore.click(showmoreclick);

			// attach the left-hand timeline navigation object to the top of the screen, even on scroll
			var timelinenav = $('#timelinenav');
			var subnav = $('#subnav');
			var subnavbottom = subnav.height() + subnav.offset().top;
			var doc = $(document);

			timelinenav.css('top', subnavbottom + 50).css('left', subnav.offset().left).show();

			var yearbox = items.filter('li.year');
			timelinenav.find('a').first().addClass('selected');

			$(window).scroll(function () {
				var scrollTop = doc.scrollTop();
				if (scrollTop - subnavbottom > 0) {
					timelinenav.addClass('timelinenavfixed');
				}
				else {
					timelinenav.removeClass('timelinenavfixed');
				}

				// highlight the correct item in the left-hand timeline navigator
				var box, prebox = null;
				yearbox.each(function () {
					box = $(this);
					if (box.offset().top - scrollTop > 10) {
						box = prebox;
						return false;
					}
					prebox = box;
				});
				if (prebox == null) {
					timelinenav.children('li').children('a').removeClass('selected').parent('li').first().children('a').addClass('selected');
				}
				else {
					var year = parseInt(box.find('h3').html());
					timelinenav.children('li').children('a').removeClass('selected').parent('li.y' + year).children('a').addClass('selected');
				}
			});

			// timelinenav onclick
			timelinenav.find('a').click(function (event) {
				event.preventDefault();
				var link = $(this);
				link.parent().siblings().children('a').removeClass('selected');
				link.addClass('selected');
				var year = link.attr('href');
				year = year.substring(year.indexOf('year=') + 5);
				var items = $('#newstimeline').children('ol').children('li.y' + year);
				if (items.length > 0) {
					// news item with the intended year was found, scroll to the first one
					$('html,body').animate({
						scrollTop: items.first().offset().top - 10
					}, 500);
				}
				else {
					// news items with the intended year was NOT found, load them through ajax
					showmore = $('<li class="showmore yearspecific"><a href="' + link.attr('href') + '">' + year + '</a></li>');
					$('#newstimeline').children('ol').append(showmore);
					showmore.click(showmoreclick).click();
				}
			});

			// timeline search function
			var searchBox = $('#searchNewsroom');
			Searchhandler.InitFocusBlur(searchBox);
			searchBox.keyup(function () {
				var term = searchBox.val().toLowerCase();
				var items = $('#newstimeline').children('ol').children('li').filter('li:not(li.showmore)').filter('li:not(li.year)').show();
				if (term.length > 2) {
					items.each(function () {
						if ($(this).text().toLowerCase().indexOf(term) == -1) {
							$(this).hide();
						}
					});
				}

			});
		}
	}
};

var OurOffer = {
	init: function ()
	{
		//Loads the mute icon 
		$('.vjs-mute-control').addClass('vjs-vol-0');
		
		
	    // setup movie navigation
	    var initMovie = function () {
			var swirls = [0, 19.5, 66.4, 90, 146];
			var stops = [15.5, 62, 85.5, 140, 162];
			var pos = 0;
			var nextStop = stops[pos];
			var jumped = true;
			var video = $('#ourofferVideo div').children('video');
			var _video = video[0];
			var videoObj = '';
			video.on('seeked', function () {
				video.animate({ opacity: 1 }, 300);
			});

			
			videoObj = '<object name="_flash_api" width="740" height="420" class="vjs-tech" id="_flash_api" data="http://vjs.zencdn.net/c/video-js.swf" type="application/x-shockwave-flash" style="display: block;" vdata1370005442554="10"><param name="movie" value="http://vjs.zencdn.net/c/video-js.swf"><param name="flashvars" value="readyFunction=_V_.flash.onReady&amp;eventProxyFunction=_V_.flash.onEvent&amp;errorEventProxyFunction=_V_.flash.onError&amp;autoplay=true&amp;preload=auto&amp;loop=false&amp;muted=false&amp;src=http%3A%2F%2Fwww.billerud.com%2FMovies%2F1_Fresher_FINAL.flv&amp;"><param name="allowScriptAccess" value="always"><param name="allowNetworking" value="all"><param name="wmode" value="opaque"><param name="bgcolor" value="#000000"></object>';

			if ($.browser.msie && $.browser.version === "8.0")
			{
				$('#video-container').html(videoObj);
			}


			/*
			video.on('timeupdate', function () {
				if (_video.currentTime > nextStop) {
					_video.pause();
					if (jumped) {
						jumped = false;
					}
					else {
						_video.currentTime = swirls[pos];
						nextStop = stops[pos];
						_video.play();
						jumped = true;
					}
				}
			});
			*/
			
			$('#ourofferVideoNav').children('a').click(function () {
				var link = $(this);
				if ($.browser.msie && $.browser.version === "8.0") {

					if (link.children('img').attr('data-ie') == "1") {
						$('#video-container').html('<object name="_flash_api" width="740" height="420" class="vjs-tech" id="_flash_api" data="http://vjs.zencdn.net/c/video-js.swf" type="application/x-shockwave-flash" style="display: block;" vdata1370005442554="10"><param name="movie" value="http://vjs.zencdn.net/c/video-js.swf"><param name="flashvars" value="readyFunction=_V_.flash.onReady&amp;eventProxyFunction=_V_.flash.onEvent&amp;errorEventProxyFunction=_V_.flash.onError&amp;autoplay=true&amp;preload=auto&amp;loop=false&amp;muted=false&amp;src=http%3A%2F%2Fwww.billerud.com%2FMovies%2F1_Fresher_FINAL.flv&amp;"><param name="allowScriptAccess" value="always"><param name="allowNetworking" value="all"><param name="wmode" value="opaque"><param name="bgcolor" value="#000000"></object>')
					}
					else if (link.children('img').attr('data-ie') == "2") {
						$('#video-container').html('<object name="_flash_api" width="740" height="420" class="vjs-tech" id="_flash_api" data="http://vjs.zencdn.net/c/video-js.swf" type="application/x-shockwave-flash" style="display: block;" vdata1370005442554="10"><param name="movie" value="http://vjs.zencdn.net/c/video-js.swf"><param name="flashvars" value="readyFunction=_V_.flash.onReady&amp;eventProxyFunction=_V_.flash.onEvent&amp;errorEventProxyFunction=_V_.flash.onError&amp;autoplay=true&amp;preload=auto&amp;loop=false&amp;muted=false&amp;src=http%3A%2F%2Fwww.billerud.com%2FMovies%2F2_Smoother_FINAL.flv&amp;"><param name="allowScriptAccess" value="always"><param name="allowNetworking" value="all"><param name="wmode" value="opaque"><param name="bgcolor" value="#000000"></object>')
					}
					else if (link.children('img').attr('data-ie') == "3") {
						$('#video-container').html('<object name="_flash_api" width="740" height="420" class="vjs-tech" id="_flash_api" data="http://vjs.zencdn.net/c/video-js.swf" type="application/x-shockwave-flash" style="display: block;" vdata1370005442554="10"><param name="movie" value="http://vjs.zencdn.net/c/video-js.swf"><param name="flashvars" value="readyFunction=_V_.flash.onReady&amp;eventProxyFunction=_V_.flash.onEvent&amp;errorEventProxyFunction=_V_.flash.onError&amp;autoplay=true&amp;preload=auto&amp;loop=false&amp;muted=false&amp;src=http%3A%2F%2Fwww.billerud.com%2FMovies%2F3_Greather_FINAL.flv&amp;"><param name="allowScriptAccess" value="always"><param name="allowNetworking" value="all"><param name="wmode" value="opaque"><param name="bgcolor" value="#000000"></object>')
					}
					else if (link.children('img').attr('data-ie') == "4") {
						$('#video-container').html('<object name="_flash_api" width="740" height="420" class="vjs-tech" id="_flash_api" data="http://vjs.zencdn.net/c/video-js.swf" type="application/x-shockwave-flash" style="display: block;" vdata1370005442554="10"><param name="movie" value="http://vjs.zencdn.net/c/video-js.swf"><param name="flashvars" value="readyFunction=_V_.flash.onReady&amp;eventProxyFunction=_V_.flash.onEvent&amp;errorEventProxyFunction=_V_.flash.onError&amp;autoplay=true&amp;preload=auto&amp;loop=false&amp;muted=false&amp;src=http%3A%2F%2Fwww.billerud.com%2FMovies%2F4_Sharper_FINAL.flv&amp;"><param name="allowScriptAccess" value="always"><param name="allowNetworking" value="all"><param name="wmode" value="opaque"><param name="bgcolor" value="#000000"></object>')
					}
					else if (link.children('img').attr('data-ie') == "5") {
						$('#video-container').html('<object name="_flash_api" width="740" height="420" class="vjs-tech" id="_flash_api" data="http://vjs.zencdn.net/c/video-js.swf" type="application/x-shockwave-flash" style="display: block;" vdata1370005442554="10"><param name="movie" value="http://vjs.zencdn.net/c/video-js.swf"><param name="flashvars" value="readyFunction=_V_.flash.onReady&amp;eventProxyFunction=_V_.flash.onEvent&amp;errorEventProxyFunction=_V_.flash.onError&amp;autoplay=true&amp;preload=auto&amp;loop=false&amp;muted=false&amp;src=http%3A%2F%2Fwww.billerud.com%2FMovies%2F5_Brighter_FINAL.flv&amp;"><param name="allowScriptAccess" value="always"><param name="allowNetworking" value="all"><param name="wmode" value="opaque"><param name="bgcolor" value="#000000"></object>')
					}
				}
				else {
					_video.src = link.children('img').attr('data') + ".mp4";
					_video.load();
				}

				$('#ourofferMessage').children('div').hide()[link.index()].style.display = 'block';

				link.addClass('selected').siblings().removeClass('selected');
				/*
				nextStop = swirls[pos + 1];
				pos = link.index();
				if (_video.paused) {
					if (link.is(':not(.selected)')) {
						video[0].play();
						setTimeout(function () {
							video.animate({ opacity: 0 }, 300);
						}, (nextStop - video[0].currentTime - 0.3) * 1000);
					}
				}
				else {
					// it was playing - move directly to the desired frame
					_video.currentTime = stops[pos];
					_video.pause();
				}
				*/
			});
		}();

		// --

		var producttiles = $('#producttiles');
		var isEmployeTiles = producttiles.hasClass("our-employees");
		var tilesAreaColumnwidth =  $('#primarycontent').attr("data-columnWidth");

		// set up the search filter function
		var searchbox = producttiles.children('div.col-4').children('input.text');
		var searchdefault = searchbox.val();
		searchbox.focus(function () {
			if (searchbox.val() === searchdefault) {
				searchbox.val('').addClass('hasvalue');
			}
		}).blur(function () {
			if (searchbox.val() === '') {
				searchbox.val(searchdefault).removeClass('hasvalue');
			}
		}).keyup(function () {
			producttiles.children('div.col-4').children('#productfilter').children('li').removeClass('selected');
			var term = searchbox.val().toLowerCase();
			if (term.length === 0) {
				producttiles.children('div.col-1').show();
			}
			else {
				producttiles.children('div.col-1').each(function () {
					var box = $(this);
					box.toggle(box.text().toLowerCase().indexOf(term) > -1);
				});
			}
		});

		// set up the filter function to the list-items
		$('#productfilter').children('li').children('a').click(function (event) {
			event.preventDefault();
			searchbox.val(searchdefault).removeClass('hasvalue');
			var link = $(this);
			link.parent().addClass('ui-tabs-selected').siblings().removeClass('ui-tabs-selected');
			var filter = link.attr('data-filter');
			if (filter === 'all') {
				producttiles.children('div.col-1').show();
			}
			else {
				producttiles.children('div.col-1').hide().filter('div.' + filter).show();
			}
		});

		// click the current tab (if we are on one of the sub pages)
		var pageId = document.body.id.substring(4);
		$('#productfilter').find('a[data-filter=cardgroup' + pageId + ']').click();

		var tileFallback = $.browser.msie;
		if (tileFallback) {
			producttiles.addClass('tile-fallback');
		}

		// bind the flip feature to each product tile
		producttiles.children('div.col-1').each(function (i) {
			var box = $(this);
			if(isEmployeTiles && i < tilesAreaColumnwidth){
				box.addClass("first-row"); 
			}

			$('<a />').addClass('close').html('&times').prependTo(box.children('div')).click(function () {
				var parent = $(this).parent().parent();
				parent.removeClass('selected leftmost rightmost');
				parent.siblings('div.col-1').animate({ opacity: 1 }, 700);
				setTimeout(function () { parent.removeClass('animate') }, 700);
				if (tileFallback) {
					box.children('div').animate({ zoom: 0.5, 'margin-top': 0, 'margin-left': 0, 'opacity': 0 }, 300);
				}
			});
			box.children('a').click(function (event) {
				event.preventDefault();
				var fallbackLeft = '-50%';
				// is this the leftmost box?
				if (box.position().left < box.width()) {
					box.addClass('leftmost');
					fallbackLeft = '0';
				}
				// is this the rightmost box?
				else if (box.position().left > (box.width() * 3) || (isEmployeTiles && box.position().left > (box.width() * (tilesAreaColumnwidth-1))) ) {
					box.addClass('rightmost');
					fallbackLeft = '-300px';
				}

				box.addClass('animate selected').css('opacity', 1);
				box.siblings('div.col-1').animate({ opacity: 0.25 }, 700).filter('div.selected').each(function () {
					var box = $(this);
					box.removeClass('selected leftmost rightmost');
					setTimeout(function () { box.removeClass('animate') }, 700);
					if (tileFallback) {
						box.children('div').animate({ zoom: 0.5, 'margin-top': 0, 'margin-left': 0, 'opacity': 0 }, 300);
					}
				});
				if (tileFallback) {
					box.children('div').css('opacity', 0).animate({ zoom: 1, 'margin-top': '0', 'margin-left': fallbackLeft, 'opacity': 1 }, 300);
				}
			});
		});
	}
};

var ProductsMarkets = {
	init: function () {
		return;
		var boxes = $('#productsmarkets').children('div').children('div');
		if (boxes.length > 0) {
			// equalize heights
			var boxpartsHeights = [];

			boxes.each(function () {
				var i = 0;
				$(this).children('div').each(function () {
					var height = $(this).height();
					if (!boxpartsHeights[i] || boxpartsHeights[i] < height) {
						boxpartsHeights[i] = height;
					}
					i++;
				});
			}).each(function () {
				var i = 0;
				$(this).children('div').each(function () {
					$(this).height(boxpartsHeights[i]);
					i++;
				});
			});

			boxes.parent().parent().css('height', boxes.height());
			var leftStart = boxes.parent().offset().left;
			// set left position on the headings
			boxes.parent().find('h2').each(function () {
				var h2 = $(this);
				h2.css('left', h2.offset().left)
					.css('top', h2.offset().top)
					.css('position', 'fixed');
			});

			// set left position and absolute position (in order to make z-index work)
			boxes.each(function () {
				var box = $(this);

				box.css('left', box.offset().left - leftStart).css('width', box.width());
			}).each(function () {
				$(this).css('position', 'absolute');
			});
		}
	}
};

/* =========================================== 10. GoogleMapHandler =========================================== */
var GoogleMapHandler = {
	init: function () {
		
		if ((window.mapsdata) && (window.mapsdata.length > 0) && (typeof google !== undefined)) {
			
			google.load("maps", "3",
			{
				"callback": GoogleMapHandler.initiateMaps,
				"language": $('html').attr('lang'),
				"key": "AIzaSyCGpoOQHJ4nsQHSo2pA9S9Qv5-1Pzd05jU",
				"other_params": "sensor=false"
			});
		}
	},
	initiateMaps: function () {
		if (typeof google.maps !== undefined) {
			$(window.mapsdata).each(function (i, dataObj) {
				dataObj.mapContainer = $('#' + dataObj.id);
				if (dataObj.mapContainer.length !== 0) {
					GoogleMapHandler.createMapMarkup(dataObj);
					GoogleMapHandler.createOptions(dataObj);
					
					dataObj.map = new google.maps.Map(dataObj.mapContainer.get(0), dataObj.mapOptions);
					dataObj.latlngbounds = new google.maps.LatLngBounds();
					dataObj.markerClusterer = null;

					GoogleMapHandler.addMarkers(dataObj);

					if (dataObj.mapOptions.createLegend === true) {
						GoogleMapHandler.createLegend(dataObj);
					}
					if (dataObj.mapOptions.createFilter === true) {
						GoogleMapHandler.createFilter(dataObj);
					}

					if (dataObj.mapOptions.markercluster === true) {
						$.getScript('/UI/scripts/libs/markerclusterer_packed.js', function (data, textStatus) {
							dataObj.markerClusterer = new MarkerClusterer(dataObj.map, dataObj.mapMarkers, dataObj.markerClustererOptions)
						});
					}

					var isRightColumn = (dataObj.mapContainer.closest('#secondarycontent').length === 1)
					if (isRightColumn) {
						dataObj.map.setCenter(dataObj.latlngbounds.getCenter());
						dataObj.map.zoom = 10;
					}
					else if (dataObj.mapOptions.useFitBounds !== undefined && dataObj.mapOptions.useFitBounds === true) {
						dataObj.map.fitBounds(dataObj.latlngbounds);
					}

				}
			});
		}
	},
	getMarkerStyle: function (markerdata, dataObj) {
		if (dataObj.markerStyles !== undefined && dataObj.markerStyles) {
			var markerImage = null;
			$(dataObj.markerStyles).each(function (k, markerStyle) {
				if (typeof markerStyle.usageCheck == 'function') {
					if (markerStyle.usageCheck(markerdata) === true && markerImage === null) {
						markerImage = markerStyle.markerImage;
					}
				}
			});
			if (markerImage === null) {
				markerImage = dataObj.markerStyles[dataObj.markerStyles.length - 1];
			}
			return markerImage;
		}
	},
	addMarkers: function (dataObj) {
		if (dataObj.markers && dataObj.markers.length > 0) {
			dataObj.asdfsafd = 'asfd';
			dataObj.mapMarkers = [];
			dataObj.infoWindow = new google.maps.InfoWindow(dataObj.infoWindowOptions);
			$(dataObj.markers).each(function (j, markerdata) {

				var marker = new window.google.maps.Marker({
					"position": new google.maps.LatLng(markerdata.position.lat, markerdata.position.lng),
					"map": dataObj.map,
					"icon": GoogleMapHandler.getMarkerStyle(markerdata, dataObj),
					"filterkeys": markerdata.filterkeys,
					"title": markerdata.headlne,
					"headline": markerdata.headline,
					"content": markerdata.content
				});
				dataObj.latlngbounds.extend(marker.position);

				dataObj.mapMarkers.push(marker);

				google.maps.event.addListener(marker, 'click', function () {
					dataObj.infoWindow.setContent(marker.content)
					dataObj.infoWindow.open(dataObj.map, marker);
				});

			});

		}
	},
	createMapMarkup: function (dataObj) {
		//dataObj.mapContainer
	},
	createFilter: function (dataObj) {
		if (dataObj.markerfilter !== undefined) {
			if ($('#page522').length === 1) {
				var filterlist = $('<ul></ul>');
				for (var filteritem in dataObj.markerfilter) {
					if (dataObj.markerfilter.hasOwnProperty(filteritem)) {
						var flitericon = '';
						$(dataObj.markerStyles).each(function () {
							if (this.filterkey && this.filterkey.indexOf(filteritem) > -1) {
								flitericon = this.markerImage.url;
							}
						});
						if (flitericon.length > 0) {
							flitericon = '<img src="' + flitericon + '" alt=""\>';
						}

						var item = $('<li><span></span>' + dataObj.markerfilter[filteritem] + '' + flitericon + '</li>')
							.data('filterid', filteritem)
							.click(function () { GoogleMapHandler.filterMarkers(dataObj, this); })
							.appendTo(filterlist);
					}
				}
				var filtermarkup = $('<div id="' + dataObj.id + '-filter" class="filter"></div>');

				filtermarkup
					.append(filterlist)
					.insertAfter('#' + dataObj.id);
			}
			else if ($('#page523').length > 0) {
				var filterlist = $('<select></select>');
				$('<option value="all"></option>')
							.data('filterid', 'all')
							.appendTo(filterlist);

				for (var filteritem in dataObj.markerfilter) {
					if (dataObj.markerfilter.hasOwnProperty(filteritem)) {
						$('<option value="' + filteritem + '">' + dataObj.markerfilter[filteritem] + '</option>')
							.data('filterid', filteritem)
							.appendTo(filterlist);
					}
				}
				filterlist.change(function () {
					var option = $(this).find('option').eq(this.selectedIndex);
					if (option.length > 0) {
						if (option.val() == 'all') {
							$(dataObj.mapMarkers).each(function (m, marker) {
								marker.setVisible(true);
							});
						}
						else {
							GoogleMapHandler.filterMarkers(dataObj, option);
						}
					}
				});

				var filtermarkup = $('<div id="' + dataObj.id + '-filter" class="filter">' + $('#mapinstructions').text() + '</div>');

				filtermarkup
					.append(filterlist)
					.insertAfter('#' + dataObj.id);
			}
			else {
				var filterlist = $('<ul></ul>')
				for (var filteritem in dataObj.markerfilter) {
					if (dataObj.markerfilter.hasOwnProperty(filteritem)) {
						$('<li>' + dataObj.markerfilter[filteritem] + '<span></span></li>')
							.data('filterid', filteritem)
							.click(function () { GoogleMapHandler.filterMarkers(dataObj, this); })
							.appendTo(filterlist);
					}
				}
				var filtermarkup = $('<div id="' + dataObj.id + '-filter" class="filter"></div>');

				filtermarkup
					.append(filterlist)
					.insertAfter('#' + dataObj.id);
			}

		}
	},
	filterMarkers: function (dataObj, item) {
		var filteritem = $(item),
			filterId = filteritem.data('filterid'),
			arMarkersToShow = [];

		filteritem
			.siblings()
				.removeClass('selected')
				.end()
			.addClass('selected');

		if (filterId && dataObj.mapMarkers && dataObj.mapMarkers.length > 0) {
			$(dataObj.mapMarkers).each(function (m, marker) {
				if (marker.filterkeys && marker.filterkeys.length > 0) {
					if (marker.filterkeys.indexOf(filterId) !== -1) {
						marker.setVisible(true);
						if ($('#page523').length > 0) {
							// trigger a click if this is the sales offices page (to force the marker speachbubble to show)
							google.maps.event.trigger(marker, 'click');
						}
						//$(marker).click();
					}
					else {
						marker.setVisible(false);
					}
				}
				else {
					if (dataObj.mapOptions.alwaysShowMarkersWithoutFilter) {
						marker.setVisible(true);
					}
				}
			});
			if (dataObj.markerClusterer) {
				dataObj.markerClusterer.repaint();
			}
		}
		else if (!filterId) {
			if (marker.filterkeys && marker.filterkeys.length > 0) { marker.setVisible(true); }
		}
	},
	createLegend: function (dataObj) {
		//Legend goes by marker styles
		if (dataObj.markerStyles !== undefined && dataObj.markerStyles && dataObj.markerStyles.length) {
			var legendList = $('<dl></dl>')
			$(dataObj.markerStyles).each(function (l, markerStyle) {

				if (markerStyle.name !== undefined && markerStyle.name) {
					$('<dt><img src="' + markerStyle.markerImage.url + '" alt=""/></dt><dd>' + markerStyle.name + '</dd>').appendTo(legendList)
				}

			});
			var legendMarkup = $('<div id="' + dataObj.id + '-legend" class="legend"/>').append(legendList);
			legendMarkup.insertAfter('#' + dataObj.id);
		}
	},
	createOptions: function (dataObj) {
		/**** Map Options ****/
		//Important: mapOptions is used by the map, mapsettings is set by the usercontrol
		//Default options defined, to be overridden by individual map settings 
		//All available options: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
		// Stockholm: 59.332583, 18.065185, Göteborg: 57.702791, 11.973102
		dataObj.mapOptions = {
			/* Map specific options */
			"center": new google.maps.LatLng(57.702791, 11.973102),
			"zoom": 10,
			"mapTypeId": google.maps.MapTypeId.ROADMAP,
			"disableDoubleClickZoom": false, /* Disable zoom on double click */
			"draggable": true,  /* Enable dragging the map */
			"maxZoom": 50,
			"minZoom": 0,
			"panControl": true, /* Show or hide the pan control */
			"zoomControl": true, /* Show or hide the zoom control */
			"scaleControl": true, /* Show or hide the scale control */
			"mapTypeControl": false, /* Show or hide the map type control */
			"rotateControl": true, /* Show or hide the rotation control */
			"streetViewControl": true, /* Show or hide the street view control */
			"scrollwheel": false, /* Use scroll to zoom in */
			/* Plugin specific options */
			"useFitBounds": true, /* let the map zoom in to cover all available markers */
			"markercluster": false, /* cluster markers if they are to close TO BE IMPLEMENTED AT A LATER STAGE */
			"useclustersummary": true,
			"createFilter": true,
			"createLegend": false,
			"alwaysShowMarkersWithoutFilter": true
		};

		/**** Set GoogleMapHandler Options ****/
		if (dataObj.mapsettings.useFitBounds !== undefined) { dataObj.mapOptions.useFitBounds = dataObj.mapsettings.useFitBounds; }
		if (dataObj.mapsettings.markercluster !== undefined) { dataObj.mapOptions.markercluster = dataObj.mapsettings.markercluster; }
		if (dataObj.mapsettings.useclustersummary !== undefined) { dataObj.mapOptions.useclustersummary = dataObj.mapsettings.useclustersummary; }
		if (dataObj.mapsettings.createFilter !== undefined) { dataObj.mapOptions.createFilter = dataObj.mapsettings.createFilter; }
		if (dataObj.mapsettings.createLegend !== undefined) { dataObj.mapOptions.createLegend = dataObj.mapsettings.createLegend; }
		if (dataObj.mapsettings.alwaysShowMarkersWithoutFilter !== undefined) { dataObj.mapOptions.alwaysShowMarkersWithoutFilter = dataObj.mapsettings.alwaysShowMarkersWithoutFilter; }

		/**** GoogleMap Options, merged with default settings ****/
		if (dataObj.mapsettings.center !== undefined && dataObj.mapsettings.center.lat !== undefined && dataObj.mapsettings.center.lat && dataObj.mapsettings.center.lng !== undefined && dataObj.mapsettings.center.lng) {
			dataObj.mapOptions.center = new google.maps.LatLng(dataObj.mapsettings.center.lat, dataObj.mapsettings.center.lng);
		}
		if (dataObj.mapsettings.zoom !== undefined) { dataObj.mapOptions.zoom = dataObj.mapsettings.zoom; }
		if (dataObj.mapsettings.disableDoubleClickZoom !== undefined) { dataObj.mapOptions.disableDoubleClickZoom = dataObj.mapsettings.disableDoubleClickZoom; }
		if (dataObj.mapsettings.draggable !== undefined) { dataObj.mapOptions.draggable = dataObj.mapsettings.draggable; }
		if (dataObj.mapsettings.maxZoom !== undefined) { dataObj.mapOptions.maxZoom = dataObj.mapsettings.maxZoom; }
		if (dataObj.mapsettings.minZoom !== undefined) { dataObj.mapOptions.minZoom = dataObj.mapsettings.minZoom; }
		if (dataObj.mapsettings.panControl !== undefined) { dataObj.mapOptions.panControl = dataObj.mapsettings.panControl; }
		if (dataObj.mapsettings.zoomControl !== undefined) { dataObj.mapOptions.zoomControl = dataObj.mapsettings.zoomControl; }
		if (dataObj.mapsettings.scaleControl !== undefined) { dataObj.mapOptions.scaleControl = dataObj.mapsettings.scaleControl; }
		if (dataObj.mapsettings.mapTypeControl !== undefined) { dataObj.mapOptions.mapTypeControl = dataObj.mapsettings.mapTypeControl; }
		if (dataObj.mapsettings.rotateControl !== undefined) { dataObj.mapOptions.rotateControl = dataObj.mapsettings.rotateControl; }
		if (dataObj.mapsettings.streetViewControl !== undefined) { dataObj.mapOptions.streetViewControl = dataObj.mapsettings.streetViewControl; }
		if (dataObj.mapsettings.scrollwheel !== undefined) { dataObj.mapOptions.scrollwheel = dataObj.mapsettings.scrollwheel; }

		if (dataObj.mapsettings.mapTypeId !== undefined) {
			switch (dataObj.mapsettings.mapTypeId) {
				case 'HYBRID':
					options.mapTypeId = google.maps.MapTypeId.HYBRID;
					break;
				case 'TERRAIN':
					options.mapTypeId = google.maps.MapTypeId.TERRAIN;
					break;
				case 'SATELLITE':
					options.mapTypeId = google.maps.MapTypeId.SATELLITE;
					break;
				case 'ROADMAP':
				default:
					options.mapTypeId = google.maps.MapTypeId.ROADMAP;
					break;
			}
		}


		/**** InfoWindow Options ****/
		dataObj.infoWindowOptions = {
			"content": ""
		};
		/*
		"disableAutoPan":false,
		"maxWidth":300,
		"zIndex":10000
		*/

		/**** Markerclusterer options****/
		/* http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html#MarkerClustererOptions */
		dataObj.markerClustererOptions = {
			"averageCenter": true,
			"gridSize": 60, //The grid size of a cluster in pixels
			"ignoreHidden": true,
			"maxZoom": null,
			"minimumClusterSize": 2,
			"zoomOnClick": true
		};

		/**** Marker styles ****/
		/* Make sure that the default pin is the last and always returns true in usageCheck*/

		dataObj.markerStyles = [
			{
				"name": 'News',
				"filterkey": "key3",
				"usageCheck": function (markerdata) {
					if (dataObj.markerfilter[markerdata.filterkeys[0]] === 'News' || dataObj.markerfilter[markerdata.filterkeys[0]] === 'Nyheter') {
						return true;
					}
					else {
						return false;
					}
				},
				"markerImage": new google.maps.MarkerImage('/UI/styles/graphics/maps/news.png',
				// This marker is 20 pixels wide by 32 pixels tall.
					new google.maps.Size(30, 46),
				// The origin for this image is 0,0.
					new google.maps.Point(0, 0),
				// The anchor for this image is the base of the flagpole at 0,32.
					new google.maps.Point(14, 39))
			},
			{
				"name": 'Production units',
				"filterkey": "key2",
				"usageCheck": function (markerdata) {
					if (dataObj.markerfilter[markerdata.filterkeys[0]] === 'Production units' || dataObj.markerfilter[markerdata.filterkeys[0]] === 'Produktionsenheter') {
						return true;
					}
					else {
						return false;
					}
				},
				"markerImage": new google.maps.MarkerImage('/UI/styles/graphics/maps/mills.png',
				// This marker is 20 pixels wide by 32 pixels tall.
					new google.maps.Size(30, 46),
				// The origin for this image is 0,0.
					new google.maps.Point(0, 0),
				// The anchor for this image is the base of the flagpole at 0,32.
					new google.maps.Point(14, 39))
			},
			{
				"name": 'Sales Offices',
				"filterkey": "key1",
				"usageCheck": function (markerdata) { return true; },
				"markerImage": new google.maps.MarkerImage('/UI/styles/graphics/maps/sales.png',
				// This marker is 20 pixels wide by 32 pixels tall.
					new google.maps.Size(30, 46),
				// The origin for this image is 0,0.
					new google.maps.Point(0, 0),
				// The anchor for this image is the base of the flagpole at 0,32.
					new google.maps.Point(14, 39))
			}

		];
	}
};

/* =========================================== 11. Vacancy List =========================================== */
var Vacancy = {
	init: function () {
		if ($('body').hasClass('summervacancies') || $('body').hasClass('vacancies')) {
			Vacancy.initFilterHookup();
		}
	},
	initFilterHookup: function () {
		$('.department').on('change', function () {
			Vacancy.filterJobList($(this).attr('class').split(' ')[0], this.value);
		});
	},
	filterJobList: function (sortType, sortValue) {
		var joblist = $('.job-list tbody');
		if (sortValue === "") {
			joblist.children('tr').show();
		} else {
			joblist.find("tr[data-billerud-" + sortType + "!= '" + sortValue + "']").hide();
			joblist.find("tr[data-billerud-" + sortType + "= '" + sortValue + "']").show();
		}
	}
};


/* =========================================== 12. Console safeguard =========================================== */
window.log = function f() { log.history = log.history || []; log.history.push(arguments); if (this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr); } };
(function (a) { function b() { } for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop()); ) { a[d] = a[d] || b; } })
(function () { try { console.log(); return window.console; } catch (a) { return (window.console = {}); } } ());


var Videoplayers = {
	init: function () {
		var width = 900;
		var height = 506;
		$('#primarycontent').find('img.video').each(function () {
			var img = $(this);
			var link = img.closest('a');
			if (link.length > 0) {
				var youtubeId = link.attr('href');
				youtubeId = youtubeId.substring(youtubeId.indexOf('v=') + 2);

				var container = $('<div class="lightbox-video"><a class="close">&times;</a><iframe src="http://www.youtube.com/embed/' + youtubeId + '/?wmode=opaque" width="' + width + '" height="' + height + '" allowtransparency="yes" frameborder="0" allowfullscreen></iframe></div>')
						.css('top', (img.offset().top - (height - img.height()) / 2))
						.css('left', ($(document).width() - width) / 2)
						.hide()
						.insertAfter(link);

				container.find('a.close').click(function () {
					container.hide();
				});

				link.click(function (e) {
					e.preventDefault();
					container.show();
				});
			}
		})
	},

	play: function (img, rand) {

		var videopath = img.attr('src').replace('.jpg', '.mp4');
		var id = videopath;
		id = id.substring(id.lastIndexOf('/') + 1);
		id = id.substring(0, id.length - 4);
		id += rand;
		var width = 900;
		var height = 506;

		videopath = window.location.protocol + '//' + window.location.host + videopath;

		var container = $('<div class="lightbox-video"><a class="close">&times;</a><video id="' + id + '" class="video-js" preload="auto" width="' + width + '" height="' + height + '"><source src="' + videopath + '" type="video/mp4" />Your browser does not support video format</video></div>')
			.css('top', (img.offset().top - (height - img.height()) / 2))
			.css('left', ($(document).width() - width) / 2).css('visibility', 'hidden');

		container.insertAfter(img);
		var player = _V_(id);

		container.find('a.close').click(function () {
			Videoplayers.stop(container, player);
		});

		player.ready(function () {
			container.css({ 'visibility': 'visible' }).fadeIn(600, function () {
				player.play();
			})
		});

		player.addEvent('ended', function () {
			Videoplayers.stop(container, player);
		});
	},

	stop: function (container, player) {
		player.pause();
		player.currentTime(0);
		container.fadeOut(function () { container.remove(); });
	}
};

/*   -------------- statistics ----------------  */

/* Attach Google Analytics */
if (typeof $ == "function") {
	var _gaq = _gaq || [];
	$(document).ready(function () {
		// Handling of local testing
		if (_gaq.push == null && typeof _gaq.disabledpush == "function")
			_gaq.push = _gaq.disabledpush;
		// Make sure there is a global hhStatistics object and that we run only once
		if (typeof hhStatistics != "object" || hhStatistics == null)
			hhStatistics = new Object();
		if (hhStatistics.runOnce)
			return;
		hhStatistics.runOnce = true;

		// Basic settings
		hhStatistics.gaAccount = "UA-6372704-1";
		hhStatistics.siteDomains = "www.billerud.com,billerud.com,www.billerud.se,billerud.se,billerud.episerverhosting.com";
		hhStatistics.downloadExtensions = "avi,bmp,bz2,doc,docx,dwg,dxf,emf,eps,exe,gif,gz,jpg,mov,mp3,mpg,msi,odg,odp,ods,odt,pdf,png,pps,ppsx,ppt,pptx,rar,rss,rtf,svg,tar,tif,txt,wav,wmf,wmv,xls,xlsx,xml,zip";

		// Specification of areas for click-area tracking
		hhStatistics.areaSpecification = [];

		// Verify the URL type
		if (!document.URL.match(/^https?:\/\/[^\/?#]+\/+/i))
			return;

		// Determine language and normalize URL
		var a, e, i, u, v;
		u = null;
		if ((e = $("#aspnetForm[action]")[0]) && (v = e.action.replace(/(^https?:\/\/[^\/]*|[?#].*$)/gi, "")).match(/^\/[a-z][a-z][\/]/i)) {
			u = v;
			hhStatistics.languageCode = v.substring(1, 3);
		}
		if (!hhStatistics.languageCode)
			hhStatistics.languageCode = "sv";
		if (u == null && /\/$/.test(v))
			u = "/" + hhStatistics.languageCode + v;
		if (u == null) {
			if (!hhStatistics.languageCode)
				hhStatistics.languageCode = ((e = $("meta[http-equiv=content-language]")[0]) ? e.content : "").toLowerCase();
			u = document.URL.replace(/(^https?:\/\/[^\/?#]+\/+(sv\/+|)|[?#].*$)/gi, "");
			a = u.split(/\/+/);
			for (i = 0; i < a.length; i++)
				a[i] = a[i].toLowerCase();
			if (a[0] != hhStatistics.languageCode)
				a.splice(0, 0, hhStatistics.languageCode);
			u = "/" + a.join("/");
		}
		hhStatistics.path = u;

		// Add search term
		if ((v = /^[^#]*[?&]q=([^&#]+).*$/i.exec(document.URL)) != null && v.length >= 2)
			hhStatistics.path = hhAddParameter(hhStatistics.path, "search", decodeURIComponent(v[1]).toLowerCase());

		// Main click handler
		hhStatistics.clickHandler = function (e) {
			// Normalize event info and target
			if (!e)
				return;
			var t = (e.target ? e.target : (e.srcElement ? e.srcElement : null));
			while (t && t.nodeName != "A" && t.nodeName != "INPUT")
				t = t.parentNode;

			// Set up lists for link-type matching
			var b, c, d, e, f, h, i, j, r;
			var domainList = this.siteDomains;
			if ((b = /^https?:\/\/([^:\/]*)/i.exec(document.URL)) != null && b.length == 2)
				domainList = "," + b[1].toLowerCase() + "," + (domainList != null ? domainList + "," : "");
			var extensionList = ("," + this.downloadExtensions + ",").toLowerCase();

			// Examine link type
			d = e = r = null;
			if (t.href != null) {
				if (domainList != null && (b = /^(https?:\/\/)([^:\/]*)([^\/]*)[\/]*(|[\/?#].*)$/i.exec(t.href)) != null && b.length == 5 && b[2].length > 0 && domainList.indexOf("," + b[2].toLowerCase() + ",") < 0) {
					d = "Exit: " + b[2].toLowerCase() + b[4];
					e = "/exit/" + b[1].toLowerCase() + b[2].toLowerCase() + b[3] + b[4];
				} else if ((b = /^mailto:([^?#]*).*$/i.exec(t.href)) != null && b.length == 2) {
					d = "Mail: " + (b[1] == "" ? "Undefined recipient" : b[1].toLowerCase());
					e = "/" + b[0].toLowerCase().replace(/:/, "/");
				} else if ((b = /\/vCardHandler.ashx\?(|[^#]*&)email=([^&#]*)/i.exec(t.href)) != null && b.length == 3) {
					d = "Vcard: " + (b[2] == "" ? "Undefined contact" : b[2].toLowerCase());
					e = "/vcard/" + b[2].toLowerCase();
				} else if ((b = /\/VCalendarHandler.ashx(|[?#].*)$/i.exec(t.href)) != null && b.length == 2) {
					if ((c = $(t).parent().find("h2")).length > 0)
						f = hhCleanText(c.text());
					else
						f = hhCleanText($(t).parent().contents().not(t).text());
					d = "Vcalendar: " + f;
					e = "/vcalendar/" + f.toLowerCase();
				} else if ((b = /^https?:\/\/[^\/]+[\/]*(\/[^?#]*)(\.|\?output=)([^.?&#]*)([?&#].*|)$/i.exec(t.href)) != null && b.length == 5 && b[3].length > 0 && extensionList.indexOf("," + b[3].toLowerCase() + ",") >= 0) {
					d = "File: " + b[1] + b[2] + b[3];
					e = b[1] + b[2] + b[3];
				}
			}
			if (d != null) {
				if (r == null) {
					var s = this;
					var x = function () {
						h = document.title;
						document.title = d;
						s.trackSubPage(e);
						document.title = h;
					};
					if (t.target == "_blank" || /^(Exit|File):/i.test(d)) {
						x();
					} else {
						setTimeout(function () { x(); }, 500);
					}
				}
			}
		};

		// Click-event attacher
		hhStatistics.setupClickEvents = function () {
			var a, p;
			if (!(a = this.areaSpecification) || typeof a != "object")
				return;
			if (this.path)
				this.createCookie("hhclickref", this.path, null);
			var t = "hhStatistics.createCookie('hhclickarea', '###', 10); if (e && typeof hhStatistics.clickHandler == 'function') hhStatistics.clickHandler(e);";
			var d = t.replace(/###/g, "UntrackedLinkArea");
			var f = $("a,input[type=submit]");
			var e, g, h, i, j, k, o;
			for (i = 0; i < f.length; i++)
				hhReplaceExistingOnClick(f[i], d);
			for (j = 0; j < a.length; j++) {
				if (typeof (a[j]) == "object" && a[j].i != null && (e = document.getElementById(a[j].i)) != null) {
					o = t.replace(/###/g, a[j].a.replace(/\\/g, "\\\\").replace(/\'/g, "\\'"));
					if (a[j].c == null && (f = $("#" + a[j].i + " a,#" + a[j].i + " input[type=submit]")).length > 0) {
						for (i = 0; i < f.length; i++)
							hhReplaceExistingOnClick(f[i], o, d);
					} else if (a[j].c == null && e.nodeName == "A") {
						hhReplaceExistingOnClick(e, o, d);
					} else if (a[j].c == null && e.parentNode.nodeName == "A") {
						hhReplaceExistingOnClick(e.parentNode, o, d);
					} else if (a[j].c != null && (g = e.getElementsByTagName("DIV")) != null && g.length > 0) {
						for (k = 0; k < g.length; k++) {
							if (g[k].className == a[j].c && (f = g[k].getElementsByTagName("A")) != null && f.length > 0) {
								for (i = 0; i < f.length; i++)
									hhReplaceExistingOnClick(f[i], o, d);
							}
						}
					}
				}
			}
			// Other functions
			if ((a = $("fieldset textarea").closest("fieldset").find('input[type="submit"]')).length > 0)
				hhReplaceExistingOnClick(a[0], "hhStatistics.trackSubPage('ContactForm');", null);
		};

		// Statistics-cookie helpers
		hhStatistics.createCookie = function (name, value, seconds) {
			if (seconds) {
				var date = new Date();
				date.setTime(date.getTime() + (seconds * 1000));
				var expires = "; expires=" + date.toGMTString();
			} else {
				var expires = "";
			}
			document.cookie = name + "=" + value + expires + "; path=/";
		}
		hhStatistics.readCookie = function (name) {
			var a = (new RegExp("(^|;) *" + name + "=([^;]*)", "")).exec(document.cookie);
			if (a != null && a.length > 2)
				return a[2];
			return null;
		}

		// Standard page tracker
		hhStatistics.trackPage = function (p) {
			// Page view
			_gaq.push(['_trackPageview', p]);
		}

		// Sub-page tracker
		hhStatistics.trackSubPage = function (s) {
			// Sub-page view
			hhStatistics.trackPage((hhStatistics.path + "/-/" + s).replace(/\/\/+/g, "/"));
		}

		// Other-action tracker
		hhStatistics.trackOther = function (o) {
			var h = document.title;
			document.title = "Other: " + o;
			_gaq.push(['_trackPageview', '/other/' + o]);
			document.title = h;
		}

		// Set up and perform page tracking
		_gaq.push(['_setAccount', hhStatistics.gaAccount]);
		hhStatistics.trackPage(hhStatistics.path);
		(function () {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
		})();

		// Attach click events (should also be run each time the DOM tree has changed)
		hhStatistics.setupClickEvents();
	});
}

/*
* Add or replace an onclick event to an element
* Version 2.2
*/
var hhExistingClickHandlers = new Object();
function hhOnClick(e, g) {
	hhReplaceOnClick(e, g, null);
}
function hhReplaceExistingOnClick(e, g) {
	var f, i, r;
	var a = ["id", "href", "className", "type", "tagName", "name", "value"];
	var k = (e && e.textContent ? e.textContent : "");
	for (f = e; f && f.tagName != "BODY"; f = f.parentNode) {
		for (i = 0; i < a.length; i++)
			if (f[a[i]])
				k += f[a[i]];
		if (f.id)
			break;
	}
	if (!(r = hhExistingClickHandlers[k]))
		r = null;
	//hhDebugLog("Handler for " + k + ": " + g);
	hhExistingClickHandlers[k] = g;
	hhReplaceOnClick(e, g, r);
}
function hhReplaceOnClick(e, g, r) {
	hhReplaceEvent(e, g, r, "click");
}
function hhReplaceEvent(e, g, r, n) {
	if (typeof (e) != "object" || e == null || n == null)
		return;
	var f = (typeof (g) == "function" ? g : hhGetEventHandler(g));
	var q = (typeof (r) == "function" ? r : hhGetEventHandler(r));
	if (typeof (e.addEventListener) == "function" || typeof (e.addEventListener) == "object") {
		if (q != null) {
			e.removeEventListener(n, q, false);
		}
		if (f != null) {
			e.removeEventListener(n, f, false);
			e.addEventListener(n, f, false);
		}
	} else if (typeof (e.attachEvent) == "function" || typeof (e.attachEvent) == "object") {
		if (q != null) {
			e.detachEvent('on' + n, q);
		}
		if (f != null) {
			e.detachEvent('on' + n, f);
			e.attachEvent('on' + n, f);
		}
	}
}

/*
* Create or get an event handler from a code string
* Version 1.2
*/
var hhLiteralEventHandlers = new Object();
function hhGetEventHandler(t) {
	var f;
	if (t == null)
		return null;
	if ((f = hhLiteralEventHandlers[t]) != null)
		return f;
	f = hhLiteralEventHandlers[t] = new Function("e", t);
	return f;
}

/*
* Plugin: hhByteCut
* Version 1.0
*/
function hhByteCut(s, n) {
	if (s == null)
		s = "";
	var t = s;
	var o = n;
	while (hhLength(t) > n && o >= 0) {
		t = hhCut(s, o--);
	}
	return t;
}

function hhGaCut(s, n) {
	if (s == null)
		s = "";
	var t = s;
	var o = n;
	while (hhGaLength(t) > n && o >= 0) {
		t = hhCut(s, o--);
	}
	return t;
}

/*
* Plugin: hhCut
* Version 1.0
*/
function hhCut(s, n) {
	if (s == null)
		s = "";
	if (n < 1)
		return "";
	if (n < 4)
		return "~";
	if (s.length > n) {
		var i = Math.ceil((n - 3) * 0.6);
		if (s[i - 1] == " ")
			i--;
		s = s.substring(0, i) + "..." + s.substring(s.length - (n - (i + 3)));
	}
	return s;
}

/*
* Plugin: hhLength
* Version 1.0
*/
function hhLength(s) {
	if (s == null)
		return 0;
	if (typeof (encodeURI) == "function") {
		return encodeURI(s).replace(/%../g, "%").length;
	}
	return s.length + s.replace(/[ -~\t\r\n]/g, "").length;
}

function hhGaLength(s) {
	if (s == null)
		return 0;
	if (typeof (encodeURIComponent) == "function") {
		return encodeURIComponent(s).length;
	}
	return s.length + s.replace(/[ -~\t\r\n]/g, "").length;
}

/*
* Plugin: hhCleanText
* Version 1.2
*/
function hhCleanText(s) {
	var b = s.match(/\[[^\][]+\]/);
	var r = s.replace(/\'/g, "").replace(/&amp;/gi, "&").replace(/ *[!-%\'-,:-?\[-`{-~ \t\r\n\/][!-%\'-,:-?\[-`{-~ \t\r\n\/]* */g, " ").replace(/( *-  *|  *- *)/g, " ").replace(/(^[ \t\r\n]*|[ \t\r\n]*$)/g, "");
	return (b ? "[" + r + "]" : r);
}
function hhCleanTextAsterisk(s) {
	return s.replace(/\'/g, "").replace(/&amp;/gi, "&").replace(/ *[!-%\'-)+,:-?\[-`{-~ \t\r\n\/][!-%\'-)+,:-?\[-`{-~ \t\r\n\/]* */g, " ").replace(/( *-  *|  *- *)/g, " ").replace(/(^[ \t\r\n]*|[ \t\r\n]*$)/g, "");
}

/*
* Add a query-string parameter
* Version 1.1
*/
function hhAddParameter(u, n, v) {
	if (n == null || n == "" || v == null || v == "")
		return u;
	return u + (u.indexOf("?") == -1 ? "?" : "&") + encodeURIComponent(n) + "=" + encodeURIComponent(v);
}

/*
* Write a line of debug info if supported
*/
function tryDump(m) {
	if (typeof console == "object" && typeof console.log == "function")
		console.log(m);
	else if (typeof (dump) == "function")
		dump(m + "\r\n");
}
