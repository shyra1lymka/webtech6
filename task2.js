$(function () {

    // GUEST DATA

    const originalRooms = [
        {
            name: "Balcony",
            floor: 2,
            guests: [
                { name: "Aigerim", color: "green", time: "20:45", student: true, things: ["cup", "crumbs"] },
                { name: "Aliya", color: "black", time: "21:15", student: false, things: ["phone", "cup"] },
                { name: "Madina", color: "green", time: "22:10", student: false, things: ["phone", "bag", "crumbs"] },
                { name: "Ivan", color: "black", time: "20:10", student: true, things: ["cup"] }
            ]
        },

        {
            name: "Hall",
            floor: 2,
            guests: [
                { name: "Arman", color: "yellow", time: "20:35", student: false, things: ["bag", "glasses"] },
                { name: "Sophia", color: "purple", time: "21:20", student: true, things: ["phone"] },
                { name: "Dias", color: "green", time: "19:45", student: true, things: [] },
                { name: "Bekzat", color: "purple", time: "20:55", student: false, things: ["bag", "cup", "crumbs"] },
                { name: "Aruzhan", color: "blue", time: "21:50", student: true, things: ["phone"] },
                { name: "Saule", color: "green", time: "21:25", student: false, things: ["glasses"] }
            ]
        },

        {
            name: "Kitchen",
            floor: 1,
            guests: [
                { name: "Nurlan", color: "red", time: "19:40", student: true, things: ["phone", "cup"] },
                { name: "Emma", color: "black", time: "20:15", student: false, things: ["bag"] },
                { name: "Timur", color: "green", time: "21:05", student: true, things: ["phone", "bag", "crumbs"] },
                { name: "Sergey", color: "yellow", time: "20:50", student: false, things: [] },
                { name: "Yerlan", color: "red", time: "21:40", student: true, things: ["glasses", "phone"] },
                { name: "Kamila", color: "green", time: "20:05", student: false, things: ["cup"] }
            ]
        },

        {
            name: "Living room",
            floor: 1,
            guests: [
                { name: "Daniel", color: "blue", time: "19:55", student: true, things: ["glasses"] },
                { name: "Zarina", color: "green", time: "21:10", student: false, things: ["bag", "phone", "crumbs"] },
                { name: "Natasha", color: "yellow", time: "20:30", student: true, things: [] },
                { name: "Askar", color: "black", time: "21:00", student: true, things: ["phone"] },
                { name: "Inkar", color: "purple", time: "20:20", student: false, things: ["bag"] }
            ]
        }
    ];

    // Make a separate copy so Reset can restore everything.

    let rooms = JSON.parse(JSON.stringify(originalRooms));


    const icons = {
        phone: "📱",
        glasses: "👓",
        bag: "👜",
        cup: "☕",
        crumbs: "🍰"
    };


    let selectedGuest = null;
    let selectedCase = null;


    // CREATE GUEST

    function makeGuest(guest) {

        const thingsHtml = guest.things.map(thing => `
            <span class="thing" title="${thing}">
                ${icons[thing]}
            </span>
        `).join("");

        return $(`
            <article class="guest color-${guest.color} ${guest.student ? "aitu" : ""}"
                data-name="${guest.name}"
                data-color="${guest.color}"
                data-time="${guest.time}"
                data-student="${guest.student}"
                data-things="${guest.things.join(",")}">

                <div class="avatar-wrap">

                    <img
                        class="avatar"
                        src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(guest.name)}"
                        alt="${guest.name}"
                    >

                    ${guest.student ? '<span class="student-badge">🎓</span>' : ""}

                </div>

                <div class="guest-name">${guest.name}</div>

                <div class="guest-time">◷ ${guest.time}</div>

                <div class="things">
                    ${thingsHtml || '<span class="nothing">—</span>'}
                </div>

            </article>
        `);
    }


    // BUILD PARTY

    function buildParty() {

        $(".upstairs, .downstairs").empty();

        rooms.forEach(room => {

            const $room = $(`
                <section class="room"
                    data-room="${room.name}"
                    data-floor="${room.floor}">

                    <div class="room-heading">
                        <h3>${room.name}</h3>

                        <button class="sort-button">
                            Sort by time
                        </button>
                    </div>

                    <div class="guest-list"></div>

                </section>
            `);

            room.guests.forEach(guest => {
                $room.find(".guest-list").append(makeGuest(guest));
            });

            if (room.floor === 2) {
                $(".upstairs").append($room);
            } else {
                $(".downstairs").append($room);
            }

        });

    }


    // CASE BUTTONS

    const caseTitles = [
        "Who is in the hall?",
        "Yellow or purple clothes?",
        "AITU students upstairs?",
        "Glasses or a bag?",
        "Who came with nothing?",
        "Phone but no bag?",
        "Arrived 20:30–21:00?",
        "After 21:00, not AITU?",
        "Next to Askar?",
        "Last in each room?",
        "Third in each room?",
        "After Timur?",
        "Before someone in black?",
        "Where is Aruzhan?",
        "Rooms with fewer than 6 guests?",
        "Cup but no glasses?",
        "First guest in each room?",
        "Miras arrives!",
        "Natasha leaves!",
        "Who took the cake?"
    ];


    caseTitles.forEach((title, index) => {

        $("#case-buttons").append(`
            <button class="case-button" data-case="${index + 1}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                ${title}
            </button>
        `);

    });


    // TIME HELPER

    function timeNumber(time) {

        const parts = time.split(":");

        return Number(parts[0]) * 60 + Number(parts[1]);

    }


    // CLEAR SPOTLIGHT

    function clearSpotlight() {

        $(".guest").stop(true).fadeTo(300, 1);

        $(".room").removeClass("found");

    }


    // SPOTLIGHT EFFECT

    function spotlight($matches) {

        $(".guest").stop(true).fadeTo(300, 0.2);

        $(".room").removeClass("found");

        // If a room is selected, keep all its guests bright.

        const $rooms = $matches.filter(".room");

        $rooms.each(function () {

            const $room = $(this);

            $room.addClass("found");

            $room.find(".guest").stop(true).fadeTo(300, 1);

        });

        // Keep matching guests bright.

        const $guests = $matches.filter(".guest");

        $guests.each(function () {

            $(this).stop(true).fadeTo(300, 1);

        });

    }


    // SHOW RESULTS

    function showResults($matches, message) {

        spotlight($matches);

        $matches.filter(".guest").each(function () {

            $(this).stop(true, true)
                .animate({ top: "-8px" }, 150)
                .animate({ top: "0px" }, 150);

        });

        const names = $matches.map(function () {

            return $(this).hasClass("guest")
                ? $(this).data("name")
                : $(this).data("room");

        }).get();

        $("#result").html(`
            <strong>${message}</strong>
            <br>
            ${names.length ? names.join(", ") : "No matches found."}
            <small>
                ${names.length} result${names.length === 1 ? "" : "s"}
            </small>
        `);

    }


    // RUN CASES

    function runCase(number) {

        let $found = $();

        switch (number) {

            case 1:
                $found = $('.room[data-room="Hall"] .guest');
                break;

            case 2:
                $found = $(".guest.color-yellow, .guest.color-purple");
                break;

            case 3:
                $found = $("#floor-2 .guest.aitu");
                break;

            case 4:
                $found = $(".guest").filter(function () {
                    return $(this).is('[data-things*="glasses"], [data-things*="bag"]');
                });
                break;

            case 5:
                $found = $('.guest[data-things=""]');
                break;

            case 6:
                $found = $(".guest")
                    .filter('[data-things*="phone"]')
                    .not('[data-things*="bag"]');
                break;

            case 7:
                $found = $(".guest").filter(function () {
                    const time = timeNumber($(this).attr("data-time"));

                    return time >= 20 * 60 + 30 &&
                           time <= 21 * 60;
                });
                break;

            case 8:
                $found = $(".guest").filter(function () {
                    return timeNumber($(this).attr("data-time")) > 21 * 60;
                }).not(".aitu");
                break;

            case 9: {
                const $askar = $('.guest[data-name="Askar"]');

                $found = $askar.prev().add($askar.next());
                break;
            }

            case 10:
                $found = $(".guest-list .guest:last-child");
                break;

            case 11:
                $found = $(".guest-list .guest:nth-child(3)");
                break;

            case 12:
                $found = $('.guest[data-name="Timur"]').next();
                break;

            case 13:
                $found = $(".guest").filter(function () {
                    return $(this).next(".color-black").length > 0;
                });
                break;

            case 14:
                $found = $('.guest[data-name="Aruzhan"]').closest(".room");
                break;

            case 15:
                $found = $(".room").filter(function () {
                    return $(this).find(".guest").length < 6;
                });
                break;

            case 16:
                $found = $(".room").filter(function () {

                    const hasCup = $(this).find('[data-things*="cup"]').length > 0;

                    const hasGlasses = $(this).find('[data-things*="glasses"]').length > 0;

                    return hasCup && !hasGlasses;

                });
                break;

            case 17:
                $found = $(".guest-list .guest:first-child");
                break;

            case 18: {

                const miras = {
                    name: "Miras",
                    color: "blue",
                    time: "21:20",
                    student: true,
                    things: ["phone"]
                };

                const livingRoom = rooms.find(room => room.name === "Living room");

                if (!livingRoom.guests.some(guest => guest.name === "Miras")) {

                    const askarIndex = livingRoom.guests.findIndex(
                        guest => guest.name === "Askar"
                    );

                    livingRoom.guests.splice(askarIndex + 1, 0, miras);

                }

                buildParty();

                $found = $('.guest[data-name="Miras"]');

                break;
            }

            case 19: {

                const livingRoom = rooms.find(room => room.name === "Living room");

                const $natasha = $('.guest[data-name="Natasha"]');

                $natasha.stop(true).fadeOut(700, function () {

                    $(this).remove();

                });

                livingRoom.guests = livingRoom.guests.filter(
                    guest => guest.name !== "Natasha"
                );

                $("#result").html(`
                    <strong>Natasha is going home.</strong>
                    <br>
                    Her card is fading out and will be removed.
                    <small>1 guest leaving</small>
                `);

                spotlight($());

                return;
            }

            case 20:

                $found = $("#floor-1 .guest").filter(function () {

                    const $guest = $(this);

                    const time = timeNumber($guest.attr("data-time"));

                    const things = $guest.attr("data-things").split(",");

                    const hasCrumbs = things.includes("crumbs");

                    const hasCup = things.includes("cup");

                    const nextToStudent =
                        $guest.prev(".guest.aitu").length > 0 ||
                        $guest.next(".guest.aitu").length > 0;

                    return time > 21 * 60 &&
                           time < 21 * 60 + 30 &&
                           hasCrumbs &&
                           !hasCup &&
                           nextToStudent;

                });

                break;

        }


        const descriptions = {

            1: "Guests in the hall:",
            2: "Guests wearing yellow or purple:",
            3: "AITU students on floor 2:",
            4: "Guests with glasses or a bag:",
            5: "Guests who brought nothing:",
            6: "Guests with a phone but no bag:",
            7: "Guests who arrived from 20:30 to 21:00:",
            8: "Non-AITU guests who arrived after 21:00:",
            9: "Guests standing next to Askar:",
            10: "Last guest in each room:",
            11: "Third guest in each room:",
            12: "Guest after Timur:",
            13: "Guests standing right before someone in black:",
            14: "Aruzhan is in:",
            15: "Rooms with fewer than 6 guests:",
            16: "Rooms with a cup but no glasses:",
            17: "First guest in each room:",
            20: "The cake thief is:"

        };


        if (number === 18) {

            showResults(
                $found,
                "Miras joined the living room after Askar:"
            );

        } else {

            showResults($found, descriptions[number]);

        }

    }


    // GUEST INFORMATION CARD

    function openCard($guest) {

        if (selectedGuest) {
            closeCard();
        }

        selectedGuest = $guest;

        const name = $guest.data("name");

        const color = $guest.data("color");

        const time = $guest.data("time");

        const student = $guest.data("student");

        const things = $guest.attr("data-things").split(",").filter(Boolean);

        const roomName = $guest.closest(".room").data("room");

        const thingsText = things.length
            ? things.map(thing => {
                const words = {
                    phone: "a phone",
                    glasses: "glasses",
                    bag: "a bag",
                    cup: "a cup",
                    crumbs: "cake crumbs"
                };

                return words[thing];
            }).join(" and ")
            : "nothing";

        const $card = $(`
            <div class="guest-card">

                <button class="close-card">×</button>

                <img
                    src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(name)}"
                    alt="${name}"
                >

                <h2>${name}</h2>

                <p><strong>Room:</strong> ${roomName}</p>

                <p><strong>Arrived:</strong> ${time}</p>

                <p><strong>Clothing:</strong> ${color}</p>

                <p>${student ? "AITU student" : "Not an AITU student"}</p>

                <p>Has ${thingsText}.</p>

                <div class="move-buttons">

                    <strong>Move to another room:</strong>

                    ${rooms.filter(room => room.name !== roomName).map(room => `
                        <button class="move-button" data-room="${room.name}">
                            Move to the ${room.name.toLowerCase()}
                        </button>
                    `).join("")}

                </div>

            </div>
        `);


        $("#card-overlay").empty().append($card).fadeIn(150);

        // Start small on the guest's photo.

        const start = $guest.find(".avatar").offset();

        const startPosition = {
            top: start.top + 25,
            left: start.left + 25
        };

        $card.css({
            top: startPosition.top,
            left: startPosition.left,
            width: 0,
            opacity: 0
        });

        $card.show();

        const windowTop = $(window).scrollTop();

        const windowLeft = $(window).scrollLeft();

        const cardTop = windowTop + ($(window).height() - $card.outerHeight()) / 2;

        const cardLeft = windowLeft + ($(window).width() - $card.outerWidth()) / 2;

        $card.stop(true).animate({
            top: cardTop,
            left: cardLeft,
            width: 300,
            opacity: 1
        }, 350);

    }


    // CLOSE CARD

    function closeCard() {

        const $card = $(".guest-card");

        if (!$card.length) {
            selectedGuest = null;
            return;
        }

        const $guest = selectedGuest;

        const target = $guest && $guest.length
            ? $guest.find(".avatar").offset()
            : { top: 0, left: 0 };

        $card.stop(true).animate({

            top: target.top || 0,
            left: target.left || 0,
            width: 0,
            opacity: 0

        }, 250, function () {

            $("#card-overlay").hide().empty();

        });

        selectedGuest = null;

    }


    // CLICK GUEST

    $(document).on("click", ".guest", function (event) {

        event.stopPropagation();

        const $guest = $(this);

        if (selectedGuest && selectedGuest[0] === $guest[0]) {

            closeCard();

        } else {

            openCard($guest);

        }

    });


    // CLOSE CARD BUTTON

    $(document).on("click", ".close-card", function () {

        closeCard();

    });


    // CLOSE CARD OUTSIDE

    $("#card-overlay").on("click", function (event) {

        if (event.target === this) {
            closeCard();
        }

    });


    // ESCAPE KEY

    $(document).on("keydown", function (event) {

        if (event.key === "Escape") {
            closeCard();
        }

    });


    // MOVE GUEST

    function moveGuest($guest, newRoomName) {

        const name = $guest.data("name");

        const oldRoomName = $guest.closest(".room").data("room");

        if (oldRoomName === newRoomName) return;

        const oldRoom = rooms.find(room => room.name === oldRoomName);

        const newRoom = rooms.find(room => room.name === newRoomName);

        const guestData = oldRoom.guests.find(guest => guest.name === name);

        // Save the guest's current position.

        const start = $guest.offset();

        // Create a copy that will fly to the new room.

        const $clone = $guest.clone();

        $clone.css({
            position: "absolute",
            top: start.top,
            left: start.left,
            width: $guest.outerWidth(),
            zIndex: 1000,
            margin: 0
        });

        $("body").append($clone);

        // Animate the original place closing.

        $guest.stop(true).animate({
            opacity: 0,
            width: 0
        }, 400, function () {

            $(this).remove();

        });

        // Update the actual array.

        oldRoom.guests = oldRoom.guests.filter(guest => guest.name !== name);

        newRoom.guests.push(guestData);

        // Add guest at the end of the new room.

        const $newGuest = makeGuest(guestData).css({
            opacity: 0,
            width: 0
        });

        const $destination = $(`.room[data-room="${newRoomName}"] .guest-list`);

        $destination.append($newGuest);

        const end = $newGuest.offset();

        // Fly the clone to the destination.

        $clone.stop(true).animate({

            top: end.top,
            left: end.left

        }, 600, function () {

            $(this).remove();

            $newGuest.stop(true).animate({
                opacity: 1,
                width: 76
            }, 350);

        });

        // Close the information card.

        closeCard();

        $("#result").html(`
            <strong>${name} moved successfully!</strong>
            <br>
            ${oldRoomName} → ${newRoomName}
        `);

    }


    // MOVE BUTTONS

    $(document).on("click", ".move-button", function (event) {

        event.stopPropagation();

        if (!selectedGuest) return;

        const newRoom = $(this).data("room");

        moveGuest(selectedGuest, newRoom);

    });


    // SORT BY TIME

    $(document).on("click", ".sort-button", function () {

        const $button = $(this);

        const $room = $button.closest(".room");

        const roomName = $room.data("room");

        const roomData = rooms.find(room => room.name === roomName);

        const $list = $room.find(".guest-list");

        // Remember the original order.

        if (!roomData.originalOrder) {

            roomData.originalOrder = roomData.guests.map(guest => guest.name);

        }

        // First click sorts by time.
        // Second click restores original order.

        if (!$button.hasClass("sorted")) {

            roomData.guests.sort((a, b) => {

                return timeNumber(a.time) - timeNumber(b.time);

            });

            $button.addClass("sorted").text("Original order");

        } else {

            roomData.guests.sort((a, b) => {

                return roomData.originalOrder.indexOf(a.name) -
                       roomData.originalOrder.indexOf(b.name);

            });

            $button.removeClass("sorted").text("Sort by time");

        }

        // Remember old positions.

        const positions = {};

        $list.children(".guest").each(function () {

            positions[$(this).data("name")] = $(this).position();

        });

        // Move cards into the new order.

        roomData.guests.forEach(guest => {

            const $guest = $list.children(`[data-name="${guest.name}"]`);

            if ($guest.length) {
                $list.append($guest);
            }

        });

        // Animate cards from old positions to new positions.

        $list.children(".guest").each(function () {

            const $guest = $(this);

            const name = $guest.data("name");

            const oldPosition = positions[name];

            const newPosition = $guest.position();

            const left = oldPosition.left - newPosition.left;

            const top = oldPosition.top - newPosition.top;

            $guest.stop(true).css({

                left: left,
                top: top

            }).animate({

                left: 0,
                top: 0

            }, 450);

        });

    });


    // DETECTIVE CASE CLICKS

    $("#case-buttons").on("click", ".case-button", function () {

        const number = Number($(this).data("case"));

        closeCard();

        $(".case-button").removeClass("active");

        $(this).addClass("active");

        selectedCase = number;

        runCase(number);

    });


    // CLEAR BUTTON

    const $clearButton = $('<button class="clear-button">Clear spotlight</button>');

    $(".section-heading").append($clearButton);

    $clearButton.on("click", function () {

        clearSpotlight();

        $(".case-button").removeClass("active");

        selectedCase = null;

        $("#result").text("All guests are bright again. Choose another case!");

    });


    // RESET PARTY

    $("#reset-button").on("click", function () {

        closeCard();

        rooms = JSON.parse(JSON.stringify(originalRooms));

        buildParty();

        $(".case-button").removeClass("active");
        selectedCase = null;
        clearSpotlight();
        $("#result").text(
            "The original party has been restored. Choose a case!"
        );
    });
    buildParty();

});