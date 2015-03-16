define(["sulumedia/collection/collections","sulumedia/collection/medias","sulumedia/model/collection","sulumedia/model/media"],function(a,b,c,d){"use strict";var e={FILES:"files",SETTINGS:"settings"},f={lastVisitedCollectionKey:"last-visited-collection"},g="sulu.media.collections.",h=function(){return x.call(this,"delete-media")},i=function(){return x.call(this,"move-media")},j=function(){return x.call(this,"move")},k=function(){return x.call(this,"reload-single-media")},l=function(){return x.call(this,"reload-media")},m=function(){return x.call(this,"delete-collection")},n=function(){return x.call(this,"media-deleted")},o=function(){return x.call(this,"media-saved")},p=function(){return x.call(this,"edit-media")},q=function(){return x.call(this,"save-media")},r=function(){return x.call(this,"save-collection")},s=function(){return x.call(this,"reload-collection")},t=function(){return x.call(this,"collection-changed")},u=function(){return x.call(this,"collection-edit")},v=function(){return x.call(this,"download-media")},w=function(){return x.call(this,"breadcrumb-navigate")},x=function(a){return g+a};return{initialize:function(){this.collections=new a,this.medias=new b,this.getLocale().then(function(a){if(this.locale=a,this.bindCustomEvents(),"list"===this.options.display)this.renderList();else if("files"===this.options.display)this.renderCollectionEdit({activeTab:"files"});else{if("settings"!==this.options.display)throw"display type wrong";this.renderCollectionEdit({activeTab:"settings"})}this.startMediaEdit(),this.options.mediaId&&this.sandbox.once("sulu.media-edit.initialized",function(){this.editMedia(this.options.mediaId),this.sandbox.emit("husky.tabs.header.option.unset","mediaId")}.bind(this))}.bind(this)),this.renderMoveOverlay()},renderMoveOverlay:function(){var a=this.sandbox.dom.createElement('<div id="collection-move-container"/>');this.sandbox.dom.append(this.$el,a),this.sandbox.start([{name:"collections/components/collection-select@sulumedia",options:{el:a,instanceName:"move-collection",title:this.sandbox.translate("sulu.collection.move.overlay-title"),rootCollection:!0,disableIds:[this.options.id],disabledChildren:!0}}])},getLocale:function(){var a=this.sandbox.data.deferred();return this.sandbox.emit("sulu.media.collections-edit.get-locale",function(b){a.resolve(b)}.bind(this)),"list"===this.options.display&&a.resolve(this.sandbox.sulu.user.locale),a.promise()},getMediaModel:function(a){if(this.medias.get(a))return this.medias.get(a);var b=new d;return a&&b.set({id:a}),this.medias.push(b),b},getCollectionModel:function(a){if(this.collections.get(a))return this.collections.get(a);var b=new c;return a&&b.set({id:a}),this.collections.push(b),b},bindCustomEvents:function(){this.sandbox.on(h.call(this),this.deleteMedia.bind(this)),this.sandbox.on(i.call(this),this.moveMedia.bind(this)),this.sandbox.on(j.call(this),this.moveCollection.bind(this)),this.sandbox.on(m.call(this),this.deleteCollection.bind(this)),this.sandbox.on(p.call(this),this.editMedia.bind(this)),this.sandbox.on(q.call(this),this.saveMedia.bind(this)),this.sandbox.on(r.call(this),this.saveCollection.bind(this)),this.sandbox.on(s.call(this),this.reloadCollection.bind(this)),this.sandbox.on(k.call(this),this.reloadSingleMedia.bind(this)),this.sandbox.on(l.call(this),this.reloadMedia.bind(this)),this.sandbox.on(v.call(this),this.downloadMedia.bind(this)),this.sandbox.on(u.call(this),function(a,b){b=b?b:"files",this.sandbox.emit("sulu.router.navigate","media/collections/edit:"+a+"/"+b,!0,!0)}.bind(this)),this.sandbox.on(w.call(this),function(a){this.sandbox.emit("sulu.router.navigate","media/collections/edit:"+a.id+"/"+this.options.display);var b="/admin/api/collections/"+a.id+"?depth=1";this.sandbox.emit("husky.data-navigation.collections.set-url",b)}.bind(this))},downloadMedia:function(a){var b;this.medias.get(a)?(b=this.getMediaModel(a),this.sandbox.dom.window.location.href=b.toJSON().url):(b=this.getMediaModel(a),b.fetch({success:function(a){this.sandbox.dom.window.location.href=a.toJSON().url}.bind(this),error:function(){this.sandbox.logger.log("Error while fetching a single media")}.bind(this)}))},saveCollection:function(a,b){var c=this.getCollectionModel(a.id);c.set(a),c.save(null,{success:function(a){this.sandbox.emit(t.call(this),a.toJSON()),"function"==typeof b&&b(a.toJSON())}.bind(this),error:function(){this.sandbox.logger.log("Error while saving collection")}.bind(this)})},reloadCollection:function(a,b,c){var d=this.getCollectionModel(a);d.fetch({data:b,success:function(a){"function"==typeof c&&c(a.toJSON())}.bind(this),error:function(){this.sandbox.logger.log("Error while fetching a single collection")}.bind(this)})},reloadSingleMedia:function(a,b,c){var d=this.getMediaModel(a);d.fetch({data:b,success:function(a){"function"==typeof c&&c(a.toJSON())}.bind(this),error:function(){this.sandbox.logger.log("Error while fetching a single media")}.bind(this)})},reloadMedia:function(a,b,c){var d=[];this.sandbox.util.foreach(a,function(e){this.reloadSingleMedia(e.id,b,function(b){d.push(b),d.length===a.length&&c(d)}.bind(this))}.bind(this))},deleteMedia:function(a,b,c,d){var e,f=a.length,g=0,h=!1,i=function(){this.sandbox.util.foreach(a,function(a){e=this.getMediaModel(a),e.destroy({success:function(){h=++g===f,"function"==typeof c?c(a,h):this.sandbox.emit(n.call(this),a,h)}.bind(this),error:function(){this.sandbox.logger.log("Error while deleting a single media")}.bind(this)})}.bind(this))}.bind(this);d===!0?i():this.sandbox.sulu.showDeleteDialog(function(a){a===!0&&("function"==typeof b&&b(),i())}.bind(this))},moveMedia:function(a,b,c){this.sandbox.util.foreach(a,function(a){this.sandbox.util.save("/admin/api/media/"+a+"?action=move&destination="+b.id,"POST").then(function(){"function"==typeof c&&c(a)}.bind(this)).fail(function(){this.sandbox.logger.log("Error while moving a single media")}.bind(this))}.bind(this))},moveCollection:function(a,b,c){this.sandbox.util.save(["/admin/api/collections/",a,"?action=move",b?"&destination="+b.id:""].join(""),"POST").then(function(){"function"==typeof c&&c(a)}.bind(this)).fail(function(){this.sandbox.logger.log("Error while moving a single media")}.bind(this))},deleteCollection:function(a){this.sandbox.sulu.showDeleteDialog(function(b){if(b===!0){var c=this.getCollectionModel(a);c.destroy({success:function(){this.sandbox.sulu.unlockDeleteSuccessLabel();var a="/admin/api/collections"+(this.options.data._embedded.parent?"/"+this.options.data._embedded.parent.id+"?depth=1":"");this.sandbox.emit("husky.data-navigation.collections.set-url",a),this.options.data._embedded.parent?this.sandbox.emit("sulu.router.navigate","media/collections/edit:"+this.options.data._embedded.parent.id+"/"+this.options.display):this.sandbox.emit("sulu.router.navigate","media/collections/root")}.bind(this),error:function(){this.sandbox.logger.log("Error while deleting a collection")}.bind(this)})}}.bind(this))},editMedia:function(a){this.sandbox.dom.isArray(a)?1===a.length?this.editSingleMedia(a[0]):this.editMultipleMedia(a):this.editSingleMedia(a)},editSingleMedia:function(a){var b;this.medias.get(a)?(b=this.getMediaModel(a),this.sandbox.emit("sulu.media-edit.edit",b.toJSON())):(this.sandbox.emit("sulu.media-edit.loading"),b=this.getMediaModel(a),b.fetch({success:function(a){this.sandbox.emit("sulu.media-edit.edit",a.toJSON())}.bind(this),error:function(){this.sandbox.logger.log("Error while fetching a single media")}.bind(this)}))},editMultipleMedia:function(a){var b,c=[],d=function(){c.length===a.length&&this.sandbox.emit("sulu.media-edit.edit",c)}.bind(this);this.sandbox.util.foreach(a,function(a){this.medias.get(a)?(c.push(this.getMediaModel(a).toJSON()),d()):(this.sandbox.emit("sulu.media-edit.loading"),b=this.getMediaModel(a),b.fetch({success:function(a){c.push(a.toJSON()),d()}.bind(this),error:function(){this.sandbox.logger.log("Error while fetching a single media")}.bind(this)}))}.bind(this))},saveMedia:function(a,b,c){if(c!==!0){var d,e=0;this.sandbox.dom.isArray(a)||(a=[a]),this.sandbox.util.foreach(a,function(c){d=this.getMediaModel(c.id),d.set(c),d.save(null,{success:function(c){this.sandbox.emit(o.call(this),c.toJSON()),++e===a.length&&b(c.toJSON())}.bind(this),error:function(){this.sandbox.logger.log("Error while saving a single media")}.bind(this)})}.bind(this))}},renderList:function(){var a=this.sandbox.dom.createElement('<div id="collections-list-container"/>');this.sandbox.dom.append(this.$el,a),this.collections.fetch({success:function(b){this.options.data=b.toJSON(),this.sandbox.start([{name:"collections/components/list@sulumedia",options:{el:a,data:b.toJSON()}}])}.bind(this),error:function(){this.sandbox.logger.log("Error while fetching all collections")}.bind(this)})},renderCollectionEdit:function(a){var b=this.sandbox.dom.createElement('<div id="collection-edit-container"/>'),c=this.getCollectionModel(this.options.id);this.sandbox.dom.append(this.$el,b),this.sandbox.sulu.saveUserSetting(f.lastVisitedCollectionKey,this.options.id),c.fetch({data:{locale:this.locale,breadcrumb:"true"},success:function(c){this.options.data=c.toJSON(),a.activeTab===e.FILES?this.sandbox.start([{name:"collections/components/files@sulumedia",options:this.sandbox.util.extend(!0,{},{el:b,data:c.toJSON(),locale:this.locale},a)}]):a.activeTab===e.SETTINGS?this.sandbox.start([{name:"collections/components/settings@sulumedia",options:this.sandbox.util.extend(!0,{},{el:b,data:c.toJSON(),locale:this.locale},a)}]):this.sandbox.logger.log("Error. No valid tab "+this.options.content)}.bind(this),error:function(){this.sandbox.logger.log("Error while fetching a single collection")}.bind(this)})},startMediaEdit:function(){var a=this.sandbox.dom.createElement("<div/>");this.sandbox.dom.append(this.$el,a),this.sandbox.start([{name:"collections/components/media-edit@sulumedia",options:{el:a}}])}}});