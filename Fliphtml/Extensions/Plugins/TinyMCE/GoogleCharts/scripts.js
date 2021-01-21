
google.load('visualization', '1.0', { 'packages': ['corechart'] });

function parseDouble(value) {
	if (typeof value == "string") {
		//value = value.replace(",", ".").match(/^-?\d*(?:\.\d+)?/)[0];
		if (lang != "en")
			value = value.replace(" ", "").replace(",", ".");
		else
			value = value.replace(",", "");
	}

	return !isNaN(parseInt(value)) ? value * 1 : NaN;
}

function drawGoogleChart() {
	$('div.googlechart').each(function () {

		table = $(this).find('table');
		if (table.length == 0)
			return;

		params = $(this).find('div.parameters');
		target = $(this).find('div.chart').html('<span>Loading...</span>')[0];
		title = table.find('thead th:first-child').html();

		// Create the data table ---------------------------------------------------------------------------------------------------------------- 
		if (params.find('.chk-switch').attr('value') == 'true') {
			var data = new google.visualization.DataTable();
			colcount = table[0].rows[0].cells.length;
			data.addColumn('string', title);

			// define columns -------------- 
			for (var i = 1; i < colcount; i++) {
				data.addColumn('number', table[0].rows[0].cells[i].innerHTML);
			}

			// add rows -------------- 
			rowcount = table.find('tbody tr').length;
			data.addRows(rowcount);
			for (var row = 0; row < rowcount; row++) {
				data.setCell(row, 0, table[0].rows[row + 1].cells[0].innerHTML);
				for (var col = 1; col < colcount; col++) {
					data.setCell(row, col, parseDouble(table[0].rows[row + 1].cells[col].innerHTML));
				}
			}
		}
		// transposed data table ----------------------------------------------------------------------
		else {
			var data = new google.visualization.DataTable();
			colcount = table[0].rows.length;
			data.addColumn('string', title);

			// define columns -------------- 
			for (var i = 1; i < colcount; i++) {
				data.addColumn('number', table[0].rows[i].cells[0].innerHTML);
			}

			// add rows -------------- 
			rowcount = table[0].rows[0].cells.length - 1;
			data.addRows(rowcount);
			for (var row = 0; row < rowcount; row++) {
				data.setCell(row, 0, table[0].rows[0].cells[row + 1].innerHTML);
				for (var col = 1; col < colcount; col++) {
					data.setCell(row, col, parseDouble(table[0].rows[col].cells[row + 1].innerHTML));
				}
			}
		}

		// Set chart size and margins -------------- 
		width = parseInt(params.find('.chart-width').attr('value'));
		height = parseInt(params.find('.chart-height').attr('value'));
		mtop = parseInt(params.find('.chart-mtop').attr('value'));
		mbottom = parseInt(params.find('.chart-mbottom').attr('value'));
		mleft = parseInt(params.find('.chart-mleft').attr('value'));
		mright = parseInt(params.find('.chart-mright').attr('value'));

		// Set right hand y-axis --------------------
		series = null;
		if (params.find('.chk-rightaxis').attr('value') == 'true') {
			series = {} //{ 0: { targetAxisIndex: 1} };
			countRightAxisItems = parseInt(params.find('.count-right-axis').attr('value'));
			if (countRightAxisItems > colcount - 2) {
				alert('You must have at least one serie on the left y-axis.');
			}
			else {
				for (var i = (colcount - 2); i > (colcount - 2) - countRightAxisItems; i--) {
					series[i.toString()] = { targetAxisIndex: 1, type: params.find('.right-type').attr('value') };
				}
			}
		}

		hasBottomAxis = (params.find('.chk-bottomaxis').attr('value') == 'true');
		hasLeftAxis = (params.find('.chk-leftaxis').attr('value') == 'true');
		hasRightAxis = (params.find('.chk-rightaxis').attr('value') == 'true');
		
		var options = { 'title': title,
			'chartArea': { left: mleft, top: mtop, width: width - (mleft + mright), height: height - (mtop + mbottom) },
			'width': '100%',
			'height': height,
			'colors': themecolors.split(','),
			'legend': params.find('.legend-settings').attr('value'),
			'isStacked': (params.find('.chk-stack').attr('value') == 'true'),
			'reverseCategories': (params.find('.chk-reverse').attr('value') == 'true'),
			'curveType': ((params.find('.chk-smooth').attr('value') == 'true') ? 'function' : 'none'),
			'hAxis': { textStyle: { color: hasBottomAxis ? '' : 'white' }, title: hasBottomAxis ? params.find('.lbl-bottomaxis').attr('value') : '' },
			'series': series,
			'vAxes': [
					{ textStyle: { color: hasLeftAxis ? '' : 'white' }, title: hasLeftAxis ? params.find('.lbl-leftaxis').attr('value') : '', minValue: parseDouble(params.find('.min-leftaxis').attr('value')), maxValue: parseDouble(params.find('.max-leftaxis').attr('value')) },
					{ textStyle: { color: hasRightAxis ? '' : 'white' }, title: hasRightAxis ? params.find('.lbl-rightaxis').attr('value') : '', minValue: parseDouble(params.find('.min-rightaxis').attr('value')), maxValue: parseDouble(params.find('.max-rightaxis').attr('value')) }
				]
		};


		// Instantiate and draw our chart, passing in some options. -------------- 
		var chart;
		var charttype = params.find('.chart-type').attr('value');

		if (charttype == 'bar')
			chart = new google.visualization.ColumnChart(target);
		else if (charttype == 'line')
			chart = new google.visualization.LineChart(target);
		else if (charttype == 'area')
			chart = new google.visualization.AreaChart(target);
		else if (charttype == 'pie') {
			if (colcount == 2)
				chart = new google.visualization.PieChart(target);
			else {
				$(target).html('<p><strong>Pie chart</strong></p><p>The required data format for the pie chart doesn\'t match the current data.</p><p>The first column should be a string, and contain the slice label. The second column should be a number, and contain the slice value.</p>');
				return;
			}
		}

		chart.draw(data, options);

	});
}