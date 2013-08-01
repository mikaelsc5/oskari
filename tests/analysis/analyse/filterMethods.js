describe.only("Test Suite for analyse bundle's filter methods" , function() {
    var appSetup = null,
        appConf = null,
        sandbox = null,
        analyseInstance = null,
        analyseView = null,
        testLayerId = 'analyse_test',
        analyseLayerPrefix = 'oskari_analyse_layer_';

    before(function() {

        appSetup = getStartupSequence([
            'openlayers-default-theme',
            'mapfull',
            'divmanazer',
            'toolbar',
            'analyse'
        ]);

        var mapfullConf = getConfigForMapfull();
        mapfullConf.conf.plugins.push({
            "id" : "Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin"
        });
        mapfullConf.conf.layers.push({
            "id": testLayerId,
            "type": "wfslayer",
            "maxScale": 1,
            "minScale": 10000000,
            "name": "analyse test layer",
            "inspire": "Test inspire",
            "orgName": "Test organization"
        });
        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf
        };
    });

    function startApplication(done, setup, conf) {
        if(!setup) {
            // clone original settings
            setup = jQuery.extend(true, {}, appSetup);
        }
        if(!conf) {
            // clone original settings
            conf = jQuery.extend(true, {}, appConf);
        }

        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(setup, conf, function() {
            // Find handles to sandbox and stats plugin.
            sandbox = Oskari.getSandbox();
            analyseInstance = sandbox.findRegisteredModuleInstance('Analyse');
            done();
        });
    };

    describe('initialization', function() {

        before(function(done) {
            startApplication(function() {
                sandbox.postRequestByName('AddMapLayerRequest', [testLayerId, true]);
                setTimeout(function() {
                    done();
                }, 1000);
            });
        });

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(analyseInstance).to.be.ok();
            // start the analyse view
            analyseInstance.setAnalyseMode(true);
            analyseView = analyseInstance.analyse;
            expect(analyseView).to.be.ok();

        });

        it('should open a popup to select filter parameters', function() {
            var filterDialogSpy = sinon.spy(analyseView, '_createFilterDialog');
            var testLayer = sandbox.findMapLayerFromSelectedMapLayers(testLayerId);
            var filterButton = jQuery('.basic_analyse').find('div.filter');

            filterButton.click();
            expect(jQuery('.analyse-filter-popup-content').length).to.be(1);
            expect(filterDialogSpy.callCount).to.be(1);
            expect(filterDialogSpy.calledWith(testLayer)).to.be.ok();
        });

        it('should add more/remove filter options when appropriate buttons get clicked', function() {
            var addFilterButton = jQuery('div.filter-option').find('div.add-filter-option'),
                removeFilterButton;

            // At first, there's only one filter option.
            expect(jQuery('div.filter-option').length).to.be(1);
            addFilterButton.click();
            // By now there should be two
            expect(jQuery('div.filter-option').length).to.be(2);
            // and the add/remove buttons of the first one should have been replaced by boolean select.
            expect(jQuery('div.filter-option').find('select.boolean').length).to.be(1);
            removeFilterButton = jQuery('div.filter-option').find('div.remove-filter-option');
            removeFilterButton.click()
            // When the second one is removed, there should again be just one
            expect(jQuery('div.filter-option').length).to.be(1);
            // and the boolean select should be long gone.
            expect(jQuery('div.filter-option').find('select.boolean').length).to.be(0);
        });
    });

    describe('filter values', function() {
        it('should return filter values from the ui', function() {
            var filterOption = jQuery('div.filter-option'),
                testFilterValues = {
                    filters: [
                        {attribute: 'foo', operator: '=', value: 'bar'}
                    ]
                },
                attribute, operator, value, filterValues;

            // Fill in the filter values.
            filterOption.find('select.attribute').val(testFilterValues.filters[0].attribute);
            filterOption.find('select.operator').val(testFilterValues.filters[0].operator);
            filterOption.find('input[name=attribute-value]').val(testFilterValues.filters[0].value);
            // Update the filter.
            debugger;
            jQuery('.analyse-update-filter').click();

            filterValues = analyseView.getFilterJson(testLayerId);
            expect(filterValues).to.be(testFilterValues);
        });
    });

    describe('validation', function() {
        it('should pass', function() {
            var testFilterValues = {
                filters: [
                    {attribute: 'foo', operator: '=', value: 'bar'},
                    {'boolean': 'AND'},
                    {attribute: 'volume', operator: '=', value: 11}
                ]
            };

            var errors = analyseView._validateFilterValues(testFilterValues);
            expect(errors).to.be(false);
        });

        it('should fail', function() {
            var testFilterValues = {
                filters: [
                    {attribute: 'foo', operator: '=', value: null},
                    {'boolean': 'AND'},
                    {attribute: 'volume', operator: '=', value: 11}
                ]
            };

            var errors = analyseView._validateFilterValues(testFilterValues);
            expect(errors.length).to.be.greaterThan(0);
        });
    });
});