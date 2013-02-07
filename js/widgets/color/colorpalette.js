//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Color palette
//>>label: colorpalette
//>>group: Forms

define( [
	"jquery",
	"../../../jqm/js/jquery.mobile.widget",
	"./colorwidget",
	"../../behaviors/optionDemultiplexer",
	"../../../jqm/js/widgets/forms/textinput"
	], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.widget( "mobile.colorpalette", $.mobile.widget, {
	options: {
		showPreview: false,
		rows: 2,
		colors: "#ff0000,#ff8000,#ffff00,#80ff00,#00ff00,#00ff80,#00ffff,#0080ff,#0000ff,#8000ff,#ff00ff,#ff0080",
		initSelector: ":jqmData(role='colorpalette')"
	},

	_create: function() {
		var ui = {
				preview: {
					outer: $( "<div class='ui-colorpalette-preview-container ui-corner-all'></div>" ),
					inner: $( "<div class='ui-colorpalette-preview'></div>" )
				},
				table: $( "<div class='ui-colorpalette-table'></div>" ),
				row: $( "<div class='ui-colorpalette-row'></div>" ),
				entry: {
					outer: $( "<div class='ui-colorpalette-choice-container ui-corner-all'></div>" ),
					inner: $( "<div class='ui-colorpalette-choice'></div>" )
				}
			},
			clrs = this._getClrList( this.options.colors ), idx;

		// Establish the outer element
		if ( this.element.is( "input" ) ) {
			ui.outer = $( "<div class='ui-colorpalette'></div>" )
				.insertAfter( this.element )
				.append( this.element );
			this.element.css( { display: "none" } );
		} else {
			ui.outer = this.element.addClass( "ui-colorpalette" );
		}

		// Apply the proto
		ui.outer.append( ui.preview.outer );
		ui.preview.outer.append( ui.preview.inner );
		ui.outer.append( ui.table );

		$.extend( this, {
			_ui: ui,
			_clrEls: []
		});

		this.refresh();

		if ( this.options.color ) {
			// Initially, the color may not be present in the palette, so let's make a
			// palette that's guaranteed to contain it
			for ( idx = 0 ; idx < clrs.length ; idx++ ) {
				if ( this.options.color === clrs[ idx ] ) {
					break;
				}
			}
			if ( idx === clrs.length ) {
				this.option( "colors", this._makePalette( $.Color( this.options.color ) ) );
			}
		}
	},

	widget: function() {
		return this._ui.outer;
	},

	_setShowPreview: function( value ) {
		this._ui.preview.outer[ value ? "show" : "hide" ]();
	},

	_setRows: function( value ) {
		this.options.rows = value;
		this.refresh();
	},

	_setColor: function( value ) {
		var clr, activeClr;

		if ( value ) {
			clr = $.Color( value );
			activeClr = this._getElementColor( this._ui.table.find( ".ui-colorpalette-choice-active" ) );

			if ( !activeClr || ( activeClr && !activeClr.is( clr ) ) ) {
				if ( !this._findAndActivateColor( clr ) ) {
					this._setOption( "colors", this._makePalette( clr ) );
					this._findAndActivateColor( clr );
				}
			}
		}
	},

	_findAndActivateColor: function( clr ) {
		var idx, elClr, found = false;

		// Look for the color in the existing entries
		for ( idx = 0 ; idx < this._clrEls.length ; idx++ ) {
			elClr = this._getElementColor( this._clrEls[ idx ] );
			if ( elClr.is( clr ) ) {
				// If found set it as active and show it in the preview
				this._clrEls[ idx ].addClass( "ui-colorpalette-choice-active" );
				this._setElementColor( this._ui.preview.inner, clr, "background-color" );
				found = true;
				break;
			} else {
				this._clrEls[ idx ].removeClass( "ui-colorpalette-choice-active" );
			}
		}

		if ( found ) {
			// If the color was found, make sure the remaining entries are not active
			for ( idx++; idx < this._clrEls.length ; idx++ ) {
				this._clrEls[ idx ].removeClass( "ui-colorpalette-choice-active" );
			}
		}
	},

	_makePalette: function( clr ) {
		var hues = [],
			nClrs = this._clrEls.length,
			hue = clr.hue(),
			inc = 360 / nClrs,
			idxMin = 0,
			ls = [];

		for ( idx = 0 ; idx < nClrs ; idx++ ) {
			hues.push( Math.round( hue + inc * idx ) % 360 );
			if ( hues[ hues.length - 1 ] < hues[ idxMin ] ) {
				idxMin = hues.length - 1;
			}
		}

		for ( idx = 0 ; idx < nClrs ; idx++ ) {
			ls.push( clr.hue( hues[ ( idxMin + idx ) % nClrs ] ).toHexString( false ) );
		}

		return ls.join( "," );
	},

	_setDisabled: function( value ) {
		// TODO remove this when working with jQM where
		// https://github.com/jquery/jquery-mobile/issues/5390 is fixed
		this._ui.outer.toggleClass( "ui-disabled", value );
	},

	_setColors: function( value ) {
		if ( value !== this.options.colors ) {
			this._updateColors( value );
			if ( this.options.color ) {
				this._findAndActivateColor( $.Color( this.options.color ) );
			}
		}
	},

	// Correct for the situation where splitting an empty string results in an
	// array containing a single element: an empty string
	_getClrList: function( clrs ) {
		var clrAr = ( clrs || "" ).split( "," );
		return clrAr.length > 0 ? ( clrAr[ 0 ] ? clrAr : [] ) : clrAr;
	},

	_updateColors: function( clrs ) {
		var clrs = this._getClrList( clrs ), idx;

		for ( idx = 0 ; idx < this._clrEls.length ; idx++ ) {
			if ( idx < clrs.length ) {
				this._setElementColor( this._clrEls[ idx ], clrs[ idx ], "background-color" );
			} else {
				this._setElementColor( this._clrEls[ idx ], null, "background-color" );
			}
		}
	},

	_handleEntryVClick: function( e ) {
		var el = $( e.target ),
			clr = this._getElementColor( el ),
			idx = 0;

		if ( clr ) {
			for ( idx = 0 ; idx < this._clrEls.length ; idx++ ) {
				this._clrEls[ idx ].removeClass( "ui-colorpalette-choice-active" );
			}
			el.addClass( "ui-colorpalette-choice-active" );
			this._setElementColor( this._ui.preview.inner, clr, "background-color" );
			this._setColor( clr.toHexString( false ) );
		}
	},

	refresh: function() {
		var o = this.options,
			clrs = this._getClrList( o.colors ),
			nCols = Math.floor( clrs.length / o.rows ),
			idx, row, el, inner;

		this._ui.table.empty();
		this._clrEls = [];

		for ( idx = 0 ; idx < clrs.length ; idx++ ) {
			if ( idx % nCols === 0 ) {
				row = this._ui.row.clone();
				this._ui.table.append( row );
			}
			el = this._ui.entry.outer.clone();
			row.append( el );
			inner = this._ui.entry.inner.clone().appendTo( el );
			this._on( inner, { vclick: "_handleEntryVClick" } );
			this._clrEls.push( inner );
		}

		this._updateColors( o.colors );
		if ( o.color ) {
			this._findAndActivateColor( $.Color( o.color ) );
		}
	}
});

$.widget( "mobile.colorpalette", $.mobile.colorpalette, $.mobile.behaviors.colorWidget );
$.widget( "mobile.colorpalette", $.mobile.colorpalette, $.mobile.behaviors.optionDemultiplexer );

// Grab enhance from textinput, and overwrite it with a version that
// filters out colorpalettes
// FIXME: Implement one of the solutions mentioned in #54 instead
var origTextinputEnhance = $.mobile.textinput.prototype.enhance;
$.mobile.textinput.prototype.enhance = function( targets, useKeepNative ) {
	origTextinputEnhance.call( this, targets.not( $.mobile.colorpalette.prototype.options.initSelector ), useKeepNative );
};

$( document ).bind( "pagecreate create", function( e )  {
	$.mobile.colorpalette.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");