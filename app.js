	    var width = 1200, 
		height = 900; 

		var projection = d3.geoAlbersUsa(); 
		var path = d3.geoPath(); 
		var json;  
		var svg = d3.select('#map-area').append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', '0 375 1200 825'); 


		function drawMap(data, year, filterCriteria, colorFilterCriteria){
			d3.selectAll('path').remove(); 
			//hoist this to the global scope
			var tracts = data.objects.tracts.geometries; 

			var min = d3.min(tracts, function(d){return +d['properties']['density']; }); 
			console.log(min); 
			var max = d3.max(tracts, function(d){return +d['properties']['density']; }); 
			console.log(max); 
			
			var colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 4000]); 
			
			svg.selectAll('path')
				.data(topojson.feature(data, data.objects.tracts).features)
				.enter().append('path')
				.attr('d', path)
				.style('fill', function(d){
					return colorScale(+d['properties']['density']); 
				})
				.on('click', function(d){
					d3.select('#census-tract-id').text(d['id']); 
					d3.select('#pop-density').text(d['properties']['density']); 
				}); 

			svg.append('path')
				.attr('class', 'tract-borders')
				.attr('d', path(topojson.mesh(data, data.objects.tracts, function(a,b){return a!== b})));
		}	

		d3.json('va-topo.json', function(error, data){
			if (error) throw error; 
			json = data; 
			drawMap(data, '2015'); 


		})	