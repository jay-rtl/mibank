var lat = [-9.459629715,-9.513636834,-8.076173514,-4.1996531,-5.841642578,-5.863088594,-6.083332999,-9.07821275,-9.285535664,-5.516040317,-5.435104173,-9.5512199,-5.826859387,-6.432952953,-9.417347777,-6.432952953,-9.501002998,-5.819881399,-9.550927938,-4.229305672,-8.171221711,-6.934914735,-9.406615237,-5.493589298,-6.177482681,-5.658685218,-6.745551806,-5.492211895,-4.345542209,-2.571453468,-6.075950182,-3.48533131,-3.134426243,-3.275401935,-3.274869825,-9.926294337,-3.628254108,-5.747544913,-5.799965584,-9.277537077,-5.499014515,-9.07056733,-6.201842272,-6.205079687,-5.960747612,-6.158027208,-3.634381971,-5.802873047,-5.321399152,-5.541877593,-6.747821573,-5.965236439,-5.96526093,-6.207853523,-9.424341142,-4.274175736,-6.225224391,-6.233509782,-6.227499513,-6.230662369,-5.627622236,-5.630057836,-7.196903011,-7.337684699,-4.33235258,-9.918652886,-4.341462496,-4.310705863,-6.662308209,-4.328199782,-6.156111384,-6.54236639,-5.429810879,-7.20123363,-3.547901486,-3.067782717,-5.217487882,-6.073422434,-6.72609456,-9.453765946,-5.55021,-5.858890452,-4.3420836,-9.4772564,-10.3162809,-5.3204215,-6.1218439,-8.765292];

var longi = [147.1561171,147.2153612,146.1532893,152.0970699,144.2203246,144.6702689,145.383333,143.2099659,146.9855886,144.1504701,150.4198155,147.3199869,142.9662604,146.8254334,147.430059,146.8254334,147.1867899,144.6597741,147.3199389,152.0745811,146.1916788,146.3948953,147.2744171,144.1137182,147.1752751,144.3705829,155.6859124,144.0955522,152.3258118,150.8136554,145.3809831,142.051163,142.3509037,142.689169,142.6843888,151.0137044,143.0549932,144.5162458,144.6284845,147.2298761,144.1143751,143.2093582,147.1603086,147.1637671,147.1925481,147.1963739,143.056245,144.6254594,151.0085889,150.8689234,155.6899418,144.8883657,144.8907894,149.5377989,147.4009804,144.9724412,155.5655917,155.5636061,155.5659694,155.5655072,146.4553504,146.4558521,146.6455922,146.7134529,152.2545854,150.9961394,152.2644253,152.2251361,147.0040219,152.2434232,147.1894293,146.7255417,154.6716923,146.6440361,143.6268062,152.6373195,145.8049856,145.3891794,147.0011442,147.1877995,150.14285,144.2281408,152.2658636,147.1521048,150.4555213,151.02896391,141.2909388,148.239555];

var desc = ["Hanuabada - Financial Literacy Training","Pari - Financial Literacy Training","Kerema - Financial Literacy Training","Rabaul - Financial Literacy Training","Dei Council Mt Hagen - Financial Literacy Training","Minj - Financial Literacy Training","Goroka - Financial Literacy Training","Daru - Financial Literacy Training","LeaLea - Financial Literacy Training","Baiyer - Financial Literacy Training","Kimbe - Financial Literacy Training","Tubusereia - Financial Literacy Training","Tari - Financial Literacy Training","Lae - Financial Literacy Training","Sogeri - Financial Literacy Training","Lae - Financial Literacy Training","Vabukori Village - Financial Literacy Training","Banz - Financial Literacy Training","Shemby Enterprise","Metira Trading - Agent","Papuan Gulf Region Womens Fellowship - Agent","Unen Financial - Agent","Dr Lalen Simeon - Agent","Baiyer Lumusa Women In Business - Agent","Molock Choit - Agent","Kun Trading - Agent","Buin Inn - Agent","Mapure Trading - Agent","Eden Sanctuary - Agent","Lyantta Trading - Agent","Apiyameku Trading - Agent","Quwansel Trading 2 - Agent","RST Limited - Agent","Mickammy Trading - Agent","Watikodal Trading - Agent","Don & Sons Canteen - Agent","Sunrise Trading - Agent","Kimil Trading - Agent","Voice For Change - Agent","Betvin Trading - Agent","Kwinkya Baptist Womens Fellowship - Agent","United Church Western Region Women Fellowship - Agent","Denggondo - Agent","Wawet - Agent","Thamagae - Agent","Monguon Trade Stor - Agent","PM Trading - Agent","Binz Ice Ambra Association - Agent","Elhajoma General Contractors - Agent","LNS Trading - Agent","Parilla Holdings Ltd - Agent","IRRM - Agent","KGWAN Eco Habitat Inc - Agent","Ararau Cooperative - Agent","Sogeri Enterprise - Agent","Anua Negu Enterprise - Agent","Tua Denocarom Contractors - Agent","Bougainville Agrotech Ltd - Agent","Arawa Public Servants Fund - Agent","Doauto Trading - Agent","IMENG QUICK NAK FINANCE SERVICES 2 - Agent","IMENG QUICK NAK FINANCE SERVICES 1 - Agent","G.S TRADING - Agent","3 Star Contractors - Agent","Kutnapi Canteen - Agent","Logasisi Trading - Agent","Rakabai Enterprise - Agent","Ialakua Trading - Agent","Milmor Investment - Agent","Hesed Trading - Agent","Unen Choit Cooperative Society Kabwum - Agent","Glory Service Station - Agent","Buka - Branch","Bulolo - Branch","Wewak - Branch","Lihir - Branch","Madang - Branch","Goroka - Branch","Lae - Branch","Waigani Central - Branch","Kimbe - Branch", "Mt Hagen - Branch","Kokopo - Branch","MiBank - Head Office","Alotau - Branch","Bialla - Branch","Kiunga - Branch","Popondetta - Branch",];

function loadMap() {			
            var mapOptions = {
               center:new google.maps.LatLng(-6.1494, 147.6475), zoom:6,
               mapTypeId:google.maps.MapTypeId.Hybrid
            };
				
            var map = new google.maps.Map(document.getElementById("sample"),mapOptions);
			
			var agenticon = {
			url: 'pictures/agentpic.png', // url
			scaledSize: new google.maps.Size(30, 30), // scaled size
			origin: new google.maps.Point(0,0), // origin
			anchor: new google.maps.Point(0, 0) // anchor
			};
			
			var liticon = {
			url: 'pictures/notepad.png', // url
			scaledSize: new google.maps.Size(30, 30), // scaled size
			origin: new google.maps.Point(0,0), // origin
			anchor: new google.maps.Point(0, 0) // anchor
			};
			
			var branchicon = {
			url: 'pictures/nmb.png', // url
			scaledSize: new google.maps.Size(90, 25), // scaled size
			origin: new google.maps.Point(0,0), // origin
			anchor: new google.maps.Point(0, 0) // anchor
			};
			
			var infowindow = new google.maps.InfoWindow();
			var marker;
			
			for(i=0; i<17; i++) {
					marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat[i], longi[i]),
					map: map,
					draggable:true,
					icon: liticon
				}); 
			
				//---marker.setMap(map);
				
				//info window pops up when mouse over
				google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
					infowindow.setContent(desc[i]);
					infowindow.open(map, marker);
        }
				})(marker, i));

			
				//Zoom to 15 when clicked on marker
				google.maps.event.addListener(marker,'click',(function(marker, i) {
        return function() {
					map.setZoom(15);
					map.setCenter(marker.getPosition());
				}
				})(marker, i));
				
			}
			
			for(i=17; i<72; i++) {
					marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat[i], longi[i]),
					map: map,
					draggable:true,
					icon: agenticon
				}); 
			
				//---marker.setMap(map);
				
				//info window pops up when mouse over
				google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
					infowindow.setContent(desc[i]);
					infowindow.open(map, marker);
        }
				})(marker, i));

			
				//Zoom to 15 when clicked on marker
				google.maps.event.addListener(marker,'click',(function(marker, i) {
        return function() {
					map.setZoom(15);
					map.setCenter(marker.getPosition());
				}
				})(marker, i));
				
			}
			
			for(i=72; i<lat.length; i++) {
					marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat[i], longi[i]),
					map: map,
					draggable:true,
					icon: branchicon
				}); 
			
				//---marker.setMap(map);
				
				//info window pops up when mouse over
				google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
					infowindow.setContent(desc[i]);
					infowindow.open(map, marker);
        }
				})(marker, i));

			
				//Zoom to 15 when clicked on marker
				google.maps.event.addListener(marker,'click',(function(marker, i) {
        return function() {
					map.setZoom(15);
					map.setCenter(marker.getPosition());
				}
				})(marker, i));
				
			}
			
	
}