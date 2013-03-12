define([
       'config',
       'mapper/s2_root',
       'text!json/unit/root.json',
       'text!json/unit/order_without_batch.json',
       'text!json/unit/order_with_batch.json',
], function(config, Root, rootTestJson, orderWithoutBatchJson, orderWithBatchJson){
  'use strict';

  var s2, results;

  function assignResultTo(target){
    return function(source){ 
      // Assignment through side effect; simultates callback.
      results[target] = source;
    }
  }

  describe("Order Resource:-", function(){
    describe("Calling order.getBatchFor(item), where item is a tube in the order,", function(){
      describe("and the item IS NOT in a batch,", function(){
        beforeEach(function(){
          results = {};

          config.setupTest(rootTestJson);
          Root.load().done(assignResultTo('root'));
          s2 = results.root;

          config.setupTest(orderWithoutBatchJson);
          s2.tubes.findByEan13Barcode('2345678901234').done(assignResultTo('tube'));
          results.tube.order().done(assignResultTo('order'));
        });

        it("has a getBatch() method.", function(){
          expect(results.order.getBatchFor).toBeDefined();
        });

        it("returns null if the item is not in a batch.", function(){
          expect(results.order.getBatchFor(results.tube)).toBe(null);
        });
      });

      describe("and the item IS in a batch,", function(){
        beforeEach(function(){
          results = {};
          config.setupTest(rootTestJson, 0);

          Root.load().done(assignResultTo('root'));
          s2 = results.root;

          config.setupTest(orderWithBatchJson);
          s2.tubes.findByEan13Barcode('2345678901234').done(assignResultTo('tube'));
          results.tube.order().done(assignResultTo('order'));
        });

        it("returns a promise that resolves to the batch object", function(){
          expect(results.order).toBeDefined();
          expect(results.order.getBatchFor(results.tube).done).toBeDefined();
        });
      });

    });

  });
});