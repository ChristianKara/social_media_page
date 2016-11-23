//secure scope
(function() {
	//mock api call
	function getData() {
		$.ajax("posts.json", {
		    dataType: "text",
		    success: function(posts) {
						$(".loadMore").show();
						$(".loader").toggle();
		        buildOut(JSON.parse(posts));
		    },
		    error: function(jqXHR, textStatus, errorThrown) {
		        console.log(textStatus);
		    }
		});
	}


	//sort function to order incoming data
	function custom_sort(a, b) {
		return new Date(b.item_published).getTime() - new Date(a.item_published).getTime();
	}

//takes response from api call and formats layout of the pages
	function buildOut(data){
		  //sorts data into most recent
		data.items.sort(custom_sort);
		//builds out layout according to service name
		data.items.forEach(function(index){
				if(index.service_name==="Manual"){
				$('.container').append(
					"<div class='well social manual figure'><img src='" + index.item_data.image_url + "'>" +
					"<p>" + index.item_data.text + "</p>" +
					"<a href='" + index.item_data.link + "' target='_blank'> <small>" + index.item_data.link_text + "</small></a></div>"
					);
				} else if(index.service_name==="Instagram") {
				$('.container').append(
					"<div class='well social instagram figure'><span><i class='fa fa-instagram fa-3x' aria-hidden='true'></span></i><img src = '"+ index.item_data.image.medium + "'class='instaImage'/><p>" + index.item_data.caption + "</p></div>"
					);
				} else {
				$('.container').append(
					"<div class='well social twitter figure'><span><i class='fa fa-twitter fa-3x' aria-hidden='true'></i></span><img src='" + index.item_data.user.avatar + "'>" +
					"<h5>" + index.account_data.user_name + "</h5>" +
					"<p>" + index.item_data.tweet + "</p></div>"
					);
					//calls method to parse for links and hashes
				checkLinks(index.item_data);
				}
		});
	}

	function checkLinks(data){
		data=data.tweet || data.caption;
		var tweetRegex = /@\S+/g,
		tweetTag = data.search(tweetRegex),
		hashRegex = /(#[a-z0-9][a-z0-9\-_]*)/gi,
		hashTag = data.search(hashRegex),
		linkRegex = /http:\/\/t.co\/\S+/g,
		linkTag = data.search(linkRegex);
		//adds href to users refenced with @ symbol
		if (tweetTag){
			$('.well').html(function(i, h){
				return h.replace(tweetRegex, '<a href="#">$&</a>');
			});
		}
		//adds href to hashtags
		if (hashTag){
			$('.well').html(function(j, k){
				return k.replace(hashRegex, '<a href="#">$&</a>');
			});
		}
		//finds links and sources them appropriately
		if (linkTag) {
			console.log(linkRegex.exec(data));
			linkRegex.lastIndex = 0;
			var address = linkRegex.exec(data);
			if(address){
				$('.well').html(function(a, b){
					linkRegex.lastIndex=0;
					return b.replace(linkRegex, '<a target = "_blank" href="'+ address[0]+'">'+ address[0]+'</a>');
				});
			}
		}
	}

	//call more data
	$('.loadMore').click(function(){
		$('html, body').animate({scrollTop:$(document).height()}, 'slow');
		$(".loadMore").hide();
		$('.loader').toggle();
		//artificial load time to demonstrate load effect
		setTimeout(getData, 3000);
	});

	//filter buttons used to deselect and select media forms
	$('.twitterButton').click(function(){
		$(this).toggleClass('active');
		if($(this).hasClass('active')){
			$('.twitter').show();
		} else {
			$('.allButton').removeClass('active');
			$('.twitter').hide();
		}
	});
		$('.manualButton').click(function(){
			$(this).toggleClass('active');
			if($(this).hasClass('active')){
				$('.manual').show();
			} else {
				$('.allButton').removeClass('active');
				$('.manual').hide();
			}
		});
		$('.instagramButton').click(function(){
			$(this).toggleClass('active');
			if($(this).hasClass('active')){
				$('.instagram').show();
			} else {
				$('.allButton').removeClass('active');
				$('.instagram').hide();
			}
		});
		$('.allButton').click(function(){
			$(this).toggleClass('active');
			if($(this).hasClass('active')){
				$('.twitterButton').addClass('active');
				$('.manualButton').addClass('active');
				$('.instagramButton').addClass('active');
				$('.instagram').show();
				$('.manual').show();
				$('.twitter').show();
			} else {
				$(this).toggleClass('active');
			}
		});

		//sets up webpage on document ready
		$("document").ready(function(){
			getData();
		});

})();
