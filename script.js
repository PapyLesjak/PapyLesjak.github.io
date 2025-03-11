(function () {
    "use strict";
  
    const items = [
      "7️⃣",
      "❌",
      "🍓",
      "🍋",
      "🍉",
      "🍒",
      "💵",
      "🍊",
      "🍎"
    ];
    
    document.querySelector(".info").textContent = items.join(" ");
    
    const doors = document.querySelectorAll(".door");
    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#reseter").addEventListener("click", init);
    
    async function spin() {
      init(false, 1, 2);
      for (const door of doors) {
        const boxes = door.querySelector(".boxes");
        const duration = parseInt(boxes.style.transitionDuration) * 1000; // Convert to milliseconds
        boxes.style.transform = "translateY(0)";
        await new Promise((resolve) => setTimeout(resolve, duration));
      }
    }
  
    function init(firstInit = true, groups = 1, duration = 1) {
      for (const door of doors) {
        if (firstInit) {
          door.dataset.spinned = "0"; // Reset the spin status on initialization
        } else if (door.dataset.spinned === "1") {
          return; // If the door has already spun, skip initialization
        }
  
        const boxes = door.querySelector(".boxes");
        const boxesClone = boxes.cloneNode(false);
        const pool = ["❓"]; // Start with a default "question mark"
  
        if (!firstInit) {
          const arr = [];
          for (let n = 0; n < groups; n++) {
            arr.push(...items);
          }
          pool.push(...shuffle(arr)); // Shuffle items to create random order
        }
  
        boxesClone.addEventListener("transitionstart", function () {
          door.dataset.spinned = "1"; // Mark the door as spun
          this.querySelectorAll(".box").forEach((box) => {
            box.style.filter = "blur(1px)"; // Add blur effect to the boxes
          });
        }, { once: true });
  
        boxesClone.addEventListener("transitionend", function () {
          this.querySelectorAll(".box").forEach((box, index) => {
            box.style.filter = "blur(0)"; // Remove blur effect after transition
            if (index > 0) this.removeChild(box); // Remove extra boxes
          });
        }, { once: true });
  
        // Create new boxes based on the pool of items
        for (let i = pool.length - 1; i >= 0; i--) {
          const box = document.createElement("div");
          box.classList.add("box");
          box.style.width = door.clientWidth + "px";
          box.style.height = door.clientHeight + "px";
          box.textContent = pool[i];
          boxesClone.appendChild(box);
        }
  
        boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
        door.replaceChild(boxesClone, boxes); // Replace the old boxes with the new ones
      }
    }
  
    // Shuffle function for randomizing the pool
    function shuffle(arr) {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    }
  
    // Initial setup of the doors
    init();
  })();
  