var handleFilterChange = function(e){
  var type = $("#donation_type").val()
  var location = $("#location").val()

  var cardMatchType = function($card) {
    return (!type || $card.find(".card__type").text().includes(type) || type == "all")
  }

  var cardMatchLocation = function($card) {
    return (!location || $card.find(".card__location").text().includes(location) || location == "all")
  }

  var cardMatchFilters = function($card) {
    return cardMatchType($card) && cardMatchLocation($card);
  }

  $(".card").each(function() {
    var $card = $(this);

    if (cardMatchFilters($card)) {
      $card.show();
    } else {
      $card.hide();
    }
  })
}

var populateFilters = function(e) {
  var populateFilter = function(selectorInCard, filterSelector) {
    $(selectorInCard).each(function() {
      var option = $(this).text();
      var $select = $(filterSelector);
      var $option = $("<option>" + option + "</option>");

      if (!$select.text().includes(option)) {
        $select.append($option);
      }

    });
  }

  populateFilter(".card__type h3", "#donation_type");
  populateFilter(".card__location h3", "#location");

  $('select#donation_type').chosen()
  $('select#location').chosen()
}

var renderCards = function() {
  var template = $("#card_template").html();

  var isWorldPage = function() {
    return location.pathname.includes("world.html");
  };

  var getCardTypes = function(card) {
    if (Array.isArray(card.type)) {
      return card.type;
    }
    return [card.type];
  }

  var isMonetaryCard = function(card) {
    return getCardTypes(card).indexOf("Monetaria") !== -1;
  };

  var renderCardTypes = function($card, types) {
    var template = $card.find(".card__type h3").clone();
    $card.find(".card__type h3").remove();

    types.forEach(function(type) {
      $card.find(".card__type").append(template.clone().append("<span>" + type + "</span>"));
    });
  }

  var renderCard = function(card) {
    var $card = $(template);
    var $location = $("<span>" + card.location + "</span>");

    $card.find(".card__title").text(card.title);
    $card.find(".card__desc").text(card.description);
    renderCardTypes($card, getCardTypes(card));
    $card.find(".card__location h3").append($location);
    $card.find(".card__button").attr("href", card.link);
    $("#cards_container").append($card);
  };

  if (isWorldPage()) {
    Cards.filter(isMonetaryCard).forEach(renderCard);
  } else {
    Cards.forEach(renderCard);
  }
}

$(document).on("change", "#donation_type", handleFilterChange);
$(document).on("change", "#location", handleFilterChange);
$(document).ready(renderCards);
$(document).ready(populateFilters);
