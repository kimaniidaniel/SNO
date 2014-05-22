var refreshIntervalinSeconds = 500;
var contentURL = 'http://stlucianewsonline.com/?json=recentstories&callback=listPosts&callback=?';
//start application
$(document).ready(function() {
	pullContent();
	//setInterval(pullContent, refreshIntervalinSeconds*1000);
	console.log("ready");
	//handle storage events
	if (window.addEventListener) {
	  window.addEventListener("storage", listContent, false);
	} else {
	  window.attachEvent("onstorage", listContent);
	};
});

function pullContent()
{
	console.log("pulling...");
	$.getJSON(contentURL,
		function(data)
		{
			console.log(data);
			var output = "";
			var outputSticky = "";
			var imageUrl = "";
			console.log("Content Pulled successfully");
			cnt = 0;
			$.each(data.posts,function(key,val) {
				cnt++;
				var tempDiv = document.createElement("tempDiv");
				tempDiv.innerHTML = val.excerpt;
				$("a",tempDiv).remove();
				var excerpt = tempDiv.innerHTML;
				if (cnt <= 1)
				{
					imageUrl = (val.attachments.lenght>0)?val.attachments[0].images.large.url:val.thumbnail_images.medium.url;
					//outputSticky += '<div id="featuredImage" class="featuredImage"><img src="' + val.attachments[0].images.large.url + '" alt="' + val.title + '" /></div>';
					outputSticky += '<div id="featuredImage" class="featuredImage"></div>';
					outputSticky += '<div id="title" class="mainArticleTitle">' + val.title + '</div>';
					//outputSticky += '<p id="excerpt">' + excerpt + '</p>';
					//console.log(imageUrl);
				} else {
					output += '<li>';
					output += '<a href="#blogpost" onclick="showPost(' + val.id + ')">';
					output += '<h3>' + val.title + '</h3>';
                    //output += '<p class="h3">' + val.title + '</p>';
					output += (val.thumbnail) ?
						'<img src="' + val.thumbnail + '" alt="' + val.title + '" />':
						'<img src="images/viewsourcelogo.png" alt="View Source Logo" />';
					//output += '<p>' + excerpt + '</p>';
                    output += '<p>' + val.modified + ' | Comments: ' + val.comments.length + '</p>';
					output += '</a>';
					output += '</li>';
                    console.log("comments:" + val.comments.length);
				}
			}); // go through each post
			//output+='</ul>';
			//console.log(output);
			storeContent("content",output);
			storeContent("contentSticky",outputSticky);
			storeContent("contentStickyImage",imageUrl);
			console.log("Content Stored!");
			listContent();
		}
	)
	
}

function storeContent(key,content)
{
	//Store content from website
	if(typeof(Storage)!=="undefined")
	{
		localStorage.setItem(key, content);
	}
}

function getContent(key)
{
	//Retrieve content from website
	if(typeof(Storage)!=="undefined")
	{
		return localStorage.getItem(key);
	}
}

function listContent()
{
	console.log("Displaying Content");
	var output='<ul data-role="listview" data-filter="true" id="listContent">';
	output+=getContent("content");
	output+='</ul>';
	outputSticky = getContent("contentSticky");
	imageUrl = getContent("contentStickyImage");
	$('#postlist').html(output);
	$("#mainArticle").html(outputSticky);
	$("#featuredImage").css('background','url(' + imageUrl + ') no-repeat scroll center / cover transparent')
	$('#postlist').trigger('create');
	//$('#postlist').listview('refresh');
}

function showPost(id) {
	$.getJSON('http://stlucianewsonline.com/?json=get_post&post_id=' + id + '&callback=?', function(data) {
		var output='';
        console.log(data);
		output += '<h3>' + data.post.title + '</h3>';
		output += data.post.content;
		$('#mypost').html(output);
	}); //get JSON Data for Stories
} //showPost

function listPosts(data) {
	var output='<ul data-role="listview" data-filter="true">';
	var outputSticky = "";
	var imageUrl = "";
	console.log(data.posts);
	cnt = 0;
	$.each(data.posts,function(key,val) {
		cnt++;
		var tempDiv = document.createElement("tempDiv");
		tempDiv.innerHTML = val.excerpt;
		$("a",tempDiv).remove();
		var excerpt = tempDiv.innerHTML;
		if (cnt <= 1)
		{
			imageUrl = val.attachments[0].images.large.url;
			//outputSticky += '<div id="featuredImage" class="featuredImage"><img src="' + val.attachments[0].images.large.url + '" alt="' + val.title + '" /></div>';
			outputSticky += '<div id="featuredImage" class="featuredImage"></div>';
			outputSticky += '<div id="title" class="mainArticleTitle">' + val.title + '</div>';
			//outputSticky += '<p id="excerpt">' + excerpt + '</p>';
			console.log(val.attachments[0].images.medium.url);
		} else {
			output += '<li>';
			output += '<a href="#blogpost" onclick="showPost(' + val.id + ')">';
			output += '<h3>' + val.title + '</h3>';
			
			output += (val.thumbnail) ?
				'<img src="' + val.thumbnail + '" alt="' + val.title + '" />':
				'<img src="images/viewsourcelogo.png" alt="View Source Logo" />';
			output += '<p>' + excerpt + '</p>';
			output += '</a>';
			output += '</li>';
		}
	}); // go through each post
	output+='</ul>';
	$('#postlist').html(output);
	$("#mainArticle").html(outputSticky);
	$("#featuredImage").css('background','url(' + imageUrl + ') no-repeat scroll center / cover transparent')
} // lists all the posts


