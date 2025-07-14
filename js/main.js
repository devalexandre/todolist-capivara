// main.js
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let consecutiveCompletes = 0;
    let multiCompleteTimeout;
    
    const rewardMessages = [
        "Great job! 🌟",
        "Wow, you're amazing! 🎉",
        "So proud of you! 💪",
        "You did it! 🎈",
        "Super star! ✨",
        "Fantastic work! 🦄",
        "Awesome effort! 🚀",
        "Terrific job! 🐾",
        "Incredible! 🦋",
        "Wonderful! 🍀"
    ];

    // Function to create confetti effect when task is completed
    function createConfetti(count = 1) {
        const container = document.getElementById('confettiContainer');
        container.innerHTML = '';
        
        // Adjust number of confetti pieces based on consecutive completes
        const pieces = Math.min(20 + count * 5, 50);
        
        for (let i = 0; i < pieces; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '50px';
            confetti.style.backgroundColor = getRandomColor();
            
            // Add random rotation and scale
            confetti.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`;
            
            // Set animation duration and delay
            const duration = 0.8 + Math.random() * 0.5;
            const delay = Math.random() * 0.3;
            confetti.style.animation = `confetti ${duration}s ease-out ${delay}s forwards`;
            
            container.appendChild(confetti);
        }
        
        // Show bigger celebration for multiple tasks
        if (count > 1) {
            showMultiCompleteMessage(count);
        }
    }

    // Helper function to get random color
    function getRandomColor() {
        const colors = ['#ff6b6b', '#f7d794', '#6a89cc', '#60a3bc', '#e66767', '#98c1d9'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Function to play sound effects
    function playSound(soundType) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        
        switch(soundType) {
            case 'complete':
                oscillator.frequency.value = 659.25; // E5
                gainNode.gain.value = 0.1;
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
                break;
            case 'delete':
                oscillator.frequency.value = 261.63; // C4
                gainNode.gain.value = 0.1;
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
                break;
            case 'add':
                oscillator.frequency.value = 523.25; // C5
                gainNode.gain.value = 0.1;
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
                break;
            case 'multi-complete':
                // Play a sequence of notes for multiple completions
                const notes = [659.25, 783.99, 880]; // E5, G#5, A5
                let time = audioContext.currentTime;
                
                notes.forEach(note => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.type = 'sine';
                    osc.frequency.value = note;
                    gain.gain.value = 0.1;
                    
                    osc.start(time);
                    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
                    
                    time += 0.2;
                });
                break;
            case 'character':
                // Play fun character interaction sound
                oscillator.frequency.value = 1000 + Math.random() * 500; // Random high note
                gainNode.gain.value = 0.1;
                oscillator.type = 'triangle';
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
                break;
        }
        
        setTimeout(() => {
            oscillator.stop();
        }, 1000);
    }

    // Function to show a random reward message
    function showRewardMessage() {
        const rewardDiv = document.getElementById('rewardMessage');
        const randomIndex = Math.floor(Math.random() * rewardMessages.length);
        rewardDiv.textContent = rewardMessages[randomIndex];
        rewardDiv.className = 'show';
        
        // Hide the message after 3 seconds
        setTimeout(() => {
            rewardDiv.className = '';
        }, 3000);
    }

    // Function to handle task completion with game mechanics
    function completeTask(taskContent, li) {
        taskContent.classList.toggle('completed');
        if (taskContent.classList.contains('completed')) {
            // Handle consecutive completes
            consecutiveCompletes++;
            clearTimeout(multiCompleteTimeout);
            
            // Show special effects after short delay if more tasks are completed
            multiCompleteTimeout = setTimeout(() => {
                createConfetti(consecutiveCompletes);
                playSound('multi-complete');
                showRewardMessage();
                updateStickers();
                checkAchievements();
                
                // Reset consecutive counter
                consecutiveCompletes = 0;
            }, 500);
            
            // Show animated character reaction
            showCharacterReaction();
        } else {
            // Task was uncompleted, reset counter
            consecutiveCompletes = 0;
        }
    }

    // Update stickers collection
    function updateStickers() {
        const stickerCount = localStorage.getItem('stickers') || 0;
        const newStickerCount = parseInt(stickerCount) + 1;
        localStorage.setItem('stickers', newStickerCount);
        document.getElementById('stickerCount').textContent = newStickerCount;
        
        // Show sticker animation
        showStickerAnimation();
    }

    // Check for achievements
    function checkAchievements() {
        const stickerCount = parseInt(localStorage.getItem('stickers'));
        let achievementMessage = '';
        
        // Bronze Achievement
        if (stickerCount === 5) {
            achievementMessage = 'Bronze Star Achieved! 🏅 You earned your first badge!';
        }
        // Silver Achievement
        else if (stickerCount === 10) {
            achievementMessage = 'Silver Star Achieved! 🥈 Great job on your second badge!';
        }
        // Gold Achievement
        else if (stickerCount === 20) {
            achievementMessage = 'Gold Star Achieved! 🥇 Awesome job completing so many tasks!';
        }
        
        if (achievementMessage) {
            showAchievement(achievementMessage);
        }
    }

    // Show achievement notification
    function showAchievement(message) {
        const achievementDiv = document.getElementById('achievementNotification');
        achievementDiv.textContent = message;
        achievementDiv.className = 'show';
        
        // Hide the message after 5 seconds
        setTimeout(() => {
            achievementDiv.className = '';
        }, 5000);
    }

    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText !== '') {
            const li = document.createElement('li');
            li.className = 'task-item new-task';
            
            // Auto-detect task type based on keywords
            const taskTextLower = taskText.toLowerCase();
            if (taskTextLower.includes('homework') || taskTextLower.includes('study')) {
                li.classList.add('homework');
            } else if (taskTextLower.includes('play') || taskTextLower.includes('game')) {
                li.classList.add('playtime');
            } else if (taskTextLower.includes('sleep') || taskTextLower.includes('bed')) {
                li.classList.add('bedtime');
            } else {
                li.classList.add('chore');
            }
            
            // Create task content
            const taskContent = document.createElement('div');
            taskContent.className = 'task-text';
            taskContent.textContent = taskText;
            
            // Add icon based on task type
            const icon = document.createElement('span');
            icon.className = 'task-icon';
            taskContent.prepend(icon);
            
            // Button group
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            
            // Complete button
            const completeBtn = document.createElement('button');
            completeBtn.className = 'task-btn complete-btn';
            completeBtn.textContent = 'Done';
            completeBtn.addEventListener('click', function() {
                completeTask(taskContent, li);
            });
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'task-btn delete-btn';
            deleteBtn.textContent = 'Remove';
            deleteBtn.addEventListener('click', function() {
                li.remove();
                playSound('delete');
                updateTaskCount();
            });
            
            // Assemble elements
            buttonGroup.appendChild(completeBtn);
            buttonGroup.appendChild(deleteBtn);
            li.appendChild(taskContent);
            li.appendChild(buttonGroup);
            taskList.appendChild(li);
            
            // Clear input and update count
            taskInput.value = '';
            playSound('add');
            updateTaskCount();
            
            // Remove the pop-in animation class after it's done
            setTimeout(() => {
                li.classList.remove('new-task');
            }, 300);
        }
    }

    // Update task count function
    function updateTaskCount() {
        const tasks = document.querySelectorAll('#taskList li');
        document.getElementById('count').textContent = tasks.length;
        updateProgress();
    }

    // Update progress visualization
    function updateProgress() {
        const totalTasks = document.querySelectorAll('#taskList li').length;
        const completedTasks = document.querySelectorAll('.completed').length;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (totalTasks > 0) {
            const percentage = Math.round((completedTasks / totalTasks) * 100);
            progressBar.style.width = percentage + '%';
            progressBar.className = 'progress-fill';
            progressText.textContent = `${percentage}% Completed!`;
            
            // Change color based on progress
            if (percentage < 30) {
                progressBar.style.backgroundColor = '#ff6b6b';
            } else if (percentage < 70) {
                progressBar.style.backgroundColor = '#f7d794';
            } else {
                progressBar.style.backgroundColor = '#60a3bc';
            }
        } else {
            progressBar.style.width = '0%';
            progressBar.className = '';
            progressText.textContent = 'No tasks yet';
        }
    }

    // Show animated character reaction
    function showCharacterReaction() {
        const character = document.getElementById('animatedCharacter');
        
        // Randomly choose a character if multiple are available
        const characters = ['🎈', '🌈', '🦄', '🌟', '🎉', '🚀'];
        character.textContent = characters[Math.floor(Math.random() * characters.length)];
        
        // Show the character
        character.className = 'show';
        
        // Play sound effect
        playSound('character');
        
        // Hide after animation completes
        setTimeout(() => {
            character.className = '';
        }, 1500);
    }

    // Show sticker animation
    function showStickerAnimation() {
        const sticker = document.getElementById('stickerAnimation');
        sticker.className = 'show';
        
        // Animate along a path
        animateStickerPath(sticker);
        
        // Hide after animation completes
        setTimeout(() => {
            sticker.className = '';
        }, 2000);
    }

    // Animate sticker along a curved path
    function animateStickerPath(element) {
        let startLeft = 50;
        let startBottom = 0;
        let duration = 2000;
        let startTime = null;
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = (timestamp - startTime) / duration;
            
            // Curve path using sine wave
            let left = startLeft + (Math.sin(progress * Math.PI * 2) * 20);
            let bottom = startBottom + (progress * 100);
            
            element.style.left = left + '%';
            element.style.bottom = bottom + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Show multi-task completion message
    function showMultiCompleteMessage(count) {
        const multiMessage = document.getElementById('multiCompleteMessage');
        multiMessage.textContent = `Wow! You completed ${count} tasks! 🎉`;
        multiMessage.className = 'show';
        
        // Hide after animation completes
        setTimeout(() => {
            multiMessage.className = '';
        }, 4000);
    }

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    
    // Allow pressing Enter to add task
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});