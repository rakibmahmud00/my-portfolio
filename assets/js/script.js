new WOW().init();
$(window).on("load", function () {
    $(".preloader").hide();
});

$(document).ready(function () {

    // navbar scroll anim 
    // let lastScrollTop = 0;
    // let scrollDistance = 0;
    // const scrollThreshold = 200; // Adjust this value as needed

    // $(window).on('scroll', function () {
    //     let st = $(this).scrollTop();
    //     scrollDistance += Math.abs(st - lastScrollTop);

    //     if (scrollDistance > scrollThreshold) {
    //         if (st > lastScrollTop) {
    //             // Scrolling down past the threshold
    //             $('.navbar').addClass('active');
    //         } else {
    //             // Scrolling up past the threshold
    //             $('.navbar').removeClass('active');
    //         }
    //         scrollDistance = 0; // Reset the scroll distance
    //     }

    //     lastScrollTop = st;
    // });

    //widget menu box active item 
    $(".widget-menu-box ul li").on("click", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });

    // widget responsive animation 
    $('.menu-btn-1').on("click", function () {
        $(".widget-menu-box-area").toggleClass("active");
    })


    // Function to update active menu item on scroll
    function updateActiveMenuItem() {
        var scrollPosition = $(window).scrollTop();

        // Array of section IDs in the order they appear on the page
        var sectionIds = ['home', 'about', 'testimonial', 'portfolio', 'contact'];

        // Check each section
        $.each(sectionIds, function (index, sectionId) {
            var $section = $('#' + sectionId);

            var top = $section.offset().top - 100,
                bottom = top + $section.outerHeight();

            if (scrollPosition >= top && scrollPosition <= bottom) {
                $('.widget-menu-box li').removeClass('active');
                $('.widget-menu-box li a[href="#' + sectionId + '"]').parent().addClass('active');
                return false; // Exit the $.each loop once we've found the active section
            }
        });
    }

    // Update on scroll
    $(window).on('scroll', updateActiveMenuItem);

    // Update on page load



    $("#testimonial-slider").owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        autoplaySpeed: 1000,
        autoplayTimeout: 2500,
        autoplayHoverPause: true,
        nav: true,
        navText: [
            "<i class='fa-regular fa-angle-left'></i>",
            "<i class='fa-regular fa-angle-right'></i>",
        ],
        dots: true,
        items: 1,
    }); 

});


// mobile -toggle menu btn 
function menuBtnFunction(menuBtn) {
    menuBtn.classList.toggle("active");
}

// typed js 

var typed = new Typed('#typedJs', {
    strings: ["Frontend Developer.", "Graphic Designer."],
    typeSpeed: 50,
    backSpeed: 50,
    loop: true,
    loopCount: Infinity
});

// skill active 

function animateSkills() {
    const skills = document.querySelectorAll('.single-skill');
    let currentIndex = 0;
    let intervalId;

    function showSkill() {
        skills.forEach(skill => skill.classList.remove('active'));
        skills[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % skills.length;
    }

    // Start initial animation
    showSkill();
    intervalId = setInterval(showSkill, 2000);

    // Add hover handlers to each skill
    skills.forEach((skill) => {
        skill.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
            // Remove active class from all skills
            skills.forEach(s => s.classList.remove('active'));
            // Add active class to hovered skill
            skill.classList.add('active');
        });

        skill.addEventListener('mouseleave', () => {
            // Continue from current state
            currentIndex = Array.from(skills).indexOf(skill);
            currentIndex = (currentIndex + 1) % skills.length;
            showSkill();
            intervalId = setInterval(showSkill, 2000);
        });
    });
}

// Make sure to call this function when document is ready
document.addEventListener('DOMContentLoaded', animateSkills);


// progress bar animation 
function animateSkillBars() {
    const progressBars = document.querySelectorAll('.child-bar');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    // Create observer for individual bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Optionally unobserve after animation is added
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe each progress bar individually
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

document.addEventListener('DOMContentLoaded', animateSkillBars);



// Counter animation for skill percentages
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    let count = 0;
    const speed = 2000 / target; // Adjust total animation duration (2000ms) as needed

    const updateCount = () => {
        if (count < target) {
            count++;
            element.textContent = count;
            setTimeout(updateCount, speed);
        }
    };

    updateCount();
}

// Start animation when individual counter is in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, { threshold: 0.5 });

// Observe each counter individually
document.querySelectorAll('.count').forEach(counter => {
    observer.observe(counter);
});



// portfolio filter 
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.portfolio-btns button');
    const portfolioItems = document.querySelectorAll('.single-portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Handle button active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter items
            portfolioItems.forEach(item => {
                if (filterValue === '*') {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    if (item.classList.contains(filterValue.substring(1))) {
                        item.style.display = '';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });


    

});


// Counter animation function
function animateCounter(element, target, duration) {
    let start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = progress * (2 - progress);
        const current = Math.floor(easeOutQuad * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target; // Ensure we end exactly at target
        }
    }
    
    requestAnimationFrame(update);
}

// Intersection Observer to trigger counter when visible
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const target = parseInt(element.textContent);
            animateCounter(element, target, 2000); // 2000ms = 2s duration
            observer.unobserve(element); // Only animate once
        }
    });
}, observerOptions);

// Observe all counter elements
document.querySelectorAll('.countup').forEach(counter => {
    counterObserver.observe(counter);
});