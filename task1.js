$(function () {
    const rooms = [
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


        {name: "Hall",
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


        {  name: "Kitchen",
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


        {   name: "Living room",
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

    const icons = {
        phone: "📱",
        glasses: "👓",
        bag: "👜",
        cup: "☕",
        crumbs: "🍰"
    };

    function makeGuest(guest) {
        const thingsHtml = guest.things.map(thing =>
            `<span class="thing" title="${thing}">
                ${icons[thing]}
            </span>`

        ).join("");
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

                    ${guest.student
                        ? '<span class="student-badge">🎓</span>'
                        : ""
                    }
                </div>
                <div class="guest-name">
                    ${guest.name}
                </div>

                <div class="guest-time">
                    ◷ ${guest.time}
                </div>

                <div class="things">
                    ${thingsHtml || '<span class="nothing">—</span>'}
                </div>
            </article>
        `);
    }

    function buildParty() {
        $(".upstairs, .downstairs").empty();
        rooms.forEach(room => {
            const $room = $(`
                <section class="room"
                    data-room="${room.name}"
                    data-floor="${room.floor}">

                    <h3>${room.name}</h3>

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


    function timeNumber(time) {
        const parts = time.split(":");
        return Number(parts[0]) * 60 + Number(parts[1]);
    }


    function showResults($matches, message) {
        $(".guest, .room").removeClass("found");
        $matches.addClass("found");

        $matches.each(function () {
            const $item = $(this);
            $item.stop(true, true)
                .animate({ top: "-12px" }, 180)
                .animate({ top: "0px" }, 180);
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

    function runCase(number) {
        buildParty();
        $("#result").text("Investigating...");
        let $found = $();
        switch (number) {

            case 1:
                $found = $('.room[data-room="Hall"]').find(".guest");
                break;

            case 2:
                $found = $(".guest").filter(".color-yellow, .color-purple");
                break;

            case 3:
                $found = $("#floor-2 .guest.aitu");
                break;

            case 4:
                $found = $(".guest").filter(function () {
                    return $(this).is(
                        '[data-things*="glasses"], [data-things*="bag"]'
                    );
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

            case 9:
                const $askar = $('.guest[data-name="Askar"]');
                $found = $askar.prev().add($askar.next());
                break;

            case 10:
                $found = $(".guest-list").find(".guest:last-child");
                break;

            case 11:
                $found = $(".guest-list").find(".guest:nth-child(3)");
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
                $found = $(".room:has(.guest[data-things*='cup'])").filter(function () {
                    return $(this).find('.guest[data-things*="glasses"]').length === 0;
                });
                break;

            case 17:
                $found = $(".guest-list").find(".guest:first-child");
                break;

            case 18: {
                const miras = {
                    name: "Miras",
                    color: "blue",
                    time: "21:20",
                    student: true,
                    things: ["phone"]
                };
                const $miras = makeGuest(miras).hide();
                $miras.insertAfter($('.guest[data-name="Askar"]'));
                $miras.fadeIn(700);
                $found = $miras;
                break;
            }

            case 19: {
                const $natasha = $('.guest[data-name="Natasha"]');
                $natasha.fadeOut(700, function () {
                    $(this).remove();
                });
                $("#result").html(`
                    <strong>Natasha is going home.</strong>
                    <br>
                    Her card is fading out and will be removed.
                    <small>1 guest leaving</small>
                `);
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
                "Miras joined the living room between Askar and Inkar:"
            );
        } else {
            showResults($found, descriptions[number]);
        }
    }

    buildParty();

    $("#case-buttons").on("click", ".case-button", function () {
        const number = Number($(this).attr("data-case"));

        $(".case-button").removeClass("active");

        $(this).addClass("active");

        runCase(number);
    });

    $("#reset-button").on("click", function () {
    buildParty();

        $(".case-button").removeClass("active");

        $(".guest, .room").removeClass("found");

        $("#result").text(
            "The original party has been restored. Choose a case!"
        );
    });
});