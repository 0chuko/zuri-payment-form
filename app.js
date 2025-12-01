// ======================================================
// Global Task List (Used by task.html and task_detail.html)
// ======================================================
const allTasks = [
    { id: 1, name: "Like & Comment YouTube Video", description: "Follow the link, like the video, and leave a positive comment.", reward: 68.00 },
    { id: 2, name: "Subscribe to Twitter Channel", description: "Follow the provided Twitter account and turn on notifications.", reward: 75.50 },
    { id: 3, name: "Follow Instagram Influencer", description: "Find the influencer's profile and follow them.", reward: 52.00 },
    { id: 4, name: "Share TikTok Clip", description: "Share the designated TikTok clip to your feed.", reward: 90.25 },
    // Add all your tasks here
];


// ======================================================
// 1. REGISTRATION LOGIC (For register.html)
// ======================================================
const registrationForm = document.getElementById('registration-form');

if (registrationForm) {
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const password = document.getElementById('password').value;

        // Check if phone number is already registered
        if (localStorage.getItem(phoneNumber)) {
            alert('Registration failed: This phone number is already registered.');
            return;
        }

        const userData = {
            name: fullName,
            phone: phoneNumber,
            password: password, 
            balance: '0.00',
            frozen: '0.00',
            vip: '0',
            completedTasks: [] 
        };

        localStorage.setItem(phoneNumber, JSON.stringify(userData));
        
        localStorage.setItem('currentUserPhone', phoneNumber);
        localStorage.setItem('isLoggedIn', 'true');

        alert('Registration successful! Starting your dashboard tour...');
        window.location.href = 'home.html';
    });
}


// ======================================================
// 2. LOGIN LOGIC (For login.html)
// ======================================================
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const inputPhone = document.getElementById('login-phone').value;
        const inputPassword = document.getElementById('login-password').value;

        const userJSON = localStorage.getItem(inputPhone);

        if (userJSON) {
            const userData = JSON.parse(userJSON);

            if (userData.password === inputPassword) {
                localStorage.setItem('currentUserPhone', inputPhone);
                localStorage.setItem('isLoggedIn', 'true');
                alert('Login successful! Welcome back.');
                window.location.href = 'home.html';
            } else {
                alert('Login failed: Incorrect password.');
            }
        } else {
            alert('Login failed: Phone number not found. Please register.');
        }
    });
}


// ======================================================
// 3. TASK LIST DISPLAY (For task.html)
// ======================================================
const taskContainer = document.getElementById('task-list-container');

if (taskContainer) {
    const currentUserPhone = localStorage.getItem('currentUserPhone');
    const userJSON = localStorage.getItem(currentUserPhone);
    const userData = userJSON ? JSON.parse(userJSON) : { completedTasks: [] };
    const completedIds = userData.completedTasks;
    
    taskContainer.innerHTML = ''; 

    allTasks.forEach(task => {
        
        const isCompleted = completedIds.includes(task.id);
        
        let buttonText = 'GRAB';
        let buttonClass = 'bg-gradient-to-r from-green-500 to-emerald-600';
        let buttonLink = `task_detail.html?id=${task.id}`;
        
        if (isCompleted) {
            buttonText = 'COMPLETED';
            buttonClass = 'bg-gray-700 cursor-not-allowed';
            buttonLink = '#';
        }

        const taskHTML = `
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex justify-between items-center hover:scale-[1.02] transition">
                <div>
                    <p class="text-xl font-medium">${task.name}</p>
                    <p class="text-3xl text-green-400 mt-2">+$${task.reward.toFixed(2)}</p>
                </div>
                <a href="${buttonLink}" class="px-12 py-5 ${buttonClass} text-black font-bold rounded-full hover:scale-110 transition">
                    ${buttonText}
                </a>
            </div>
        `;

        taskContainer.innerHTML += taskHTML;
    });
}


// ======================================================
// 4. TASK DETAIL & COMPLETION LOGIC (For task_detail.html)
// ======================================================
const completeButton = document.getElementById('complete-button');
const taskTitle = document.getElementById('task-title');

if (completeButton) {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = parseInt(urlParams.get('id'));

    const taskData = allTasks.find(task => task.id === taskId);

    if (taskData) {
        // Update the HTML elements with the correct data
        taskTitle.textContent = taskData.name;
        document.getElementById('task-description').textContent = taskData.description;
        document.getElementById('task-reward').textContent = `+$${taskData.reward.toFixed(2)}`;

        completeButton.addEventListener('click', function() {
            const currentUserPhone = localStorage.getItem('currentUserPhone');
            const userJSON = localStorage.getItem(currentUserPhone);
            
            if (userJSON) {
                const userData = JSON.parse(userJSON);
                
                // Security check to prevent re-completion
                if (userData.completedTasks.includes(taskId)) {
                    alert('Error: You have already completed this task!');
                    window.location.href = 'home.html';
                    return;
                }

                const currentBalance = parseFloat(userData.balance || 0);
                const newBalance = currentBalance + taskData.reward;

                userData.balance = newBalance.toFixed(2);
                userData.completedTasks.push(taskId); 
                
                localStorage.setItem(currentUserPhone, JSON.stringify(userData));
                
                alert(`Task Completed! +$${taskData.reward.toFixed(2)} added to your balance.`);
                window.location.href = 'home.html';
                
            } else {
                alert('Error: Could not find user data.');
            }
        });

    } else {
        taskTitle.textContent = "Error: Task Not Found";
        completeButton.disabled = true;
    }
}


// ======================================================
// 5. LOGOUT LOGIC (Used on dashboard.html and home.html)
// ======================================================

const logoutDashboard = document.getElementById('logout-link'); 
const logoutHome = document.getElementById('home-logout-link');

function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserPhone');
    alert('You have been logged out successfully.');
    window.location.href = 'index.html'; 
}

if (logoutDashboard) {
    logoutDashboard.addEventListener('click', handleLogout);
}
if (logoutHome) {
    logoutHome.addEventListener('click', handleLogout);
}


// ======================================================
// 6. DYNAMIC INDEX.HTML LINKS (Used on index.html)
// ======================================================
function updatePublicPageLinks() {
    const navContainer = document.getElementById('nav-auth-links');
    const heroContainer = document.getElementById('hero-auth-buttons');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!navContainer || !heroContainer) {
        return;
    }

    if (isLoggedIn) {
        // LOGGED IN CONTENT
        const loggedInNavHTML = `
            <a href="dashboard.html" class="px-8 py-4 glass rounded-2xl hover:bg-white/10 transition">Dashboard</a>
            <a href="#" id="index-logout-btn" class="px-10 py-4 bg-red-600 text-white font-bold rounded-2xl hover:scale-105 transition shadow-2xl">Logout</a>
        `;
        navContainer.innerHTML = loggedInNavHTML;

        const loggedInHeroHTML = `
            <a href="dashboard.html" class="px-20 py-8 bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-black text-2xl rounded-3xl hover:scale-105 transition-all shadow-2xl">
                ACCESS YOUR DASHBOARD
            </a>
        `;
        heroContainer.innerHTML = loggedInHeroHTML;

        // Add Logout functionality to the new button
        document.getElementById('index-logout-btn').addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUserPhone');
            window.location.reload(); 
        });

    } else {
        // LOGGED OUT (PUBLIC) CONTENT
        const loggedOutNavHTML = `
            <a href="login.html" class="px-8 py-4 glass rounded-2xl hover:bg-white/10 transition">Login</a>
            <a href="register.html" class="px-10 py-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold rounded-2xl hover:scale-105 transition shadow-2xl">Register Free</a>
        `;
        navContainer.innerHTML = loggedOutNavHTML;

        const loggedOutHeroHTML = `
            <a href="register.html" class="px-20 py-8 bg-white text-black font-black text-2xl rounded-3xl hover:scale-105 transition-all shadow-2xl">
                START EARNING NOW — FREE
            </a>
            <a href="login.html" class="px-20 py-8 glass border-2 border-white/30 text-white font-bold text-2xl rounded-3xl hover:bg-white/20 transition-all">
                LOGIN TO DASHBOARD
            </a>
        `;
        heroContainer.innerHTML = loggedOutHeroHTML;
    }
}

// Run the function when the page loads
updatePublicPageLinks();
