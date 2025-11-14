# 🚀 SpaceVoyager – Simple Booking Website

This project is a **simple travel booking website** built with **HTML**, **Tailwind CSS**, and **JavaScript**.  
The user can choose a destination, accommodation, number of passengers, and a date.  
After booking, the information is saved in **localStorage**, and the user can view all their tickets on the **My Bookings** page.

---

## 📌 Main Features

### ✔ Booking System
The user selects:  
- **Destination**  
- **Accommodation**  
- **Passengers**  
- **Departure date** (must be 30+ days ahead)  

All data is saved as **one booking object** in localStorage.

---

### ✔ Save Multiple Bookings
Each user can create **multiple bookings**, and they are stored together without deleting previous ones.

---

### ✔ User Login & Personal Bookings
Only the bookings of the **logged-in user** appear on the **My Bookings** page.  
If a new user logs in, they only see **their own tickets**.

---

### ✔ View Tickets
On the **My Bookings** page, each booking is shown as a **ticket card** containing:  
- Destination  
- Accommodation  
- Date  
- Price  
- Booking date  
- List of passengers  

---

### ✔ Download Ticket as PDF
Users can download their ticket using **window.print()**.  
Only the ticket is printed — the **Delete/Download buttons** are hidden in the PDF.

---

### ✔ Delete Booking
Each ticket has a **Delete button** that removes it from localStorage and from the page.

---

## 📁 Technologies Used
- HTML  
- Tailwind CSS  
- JavaScript (ES6)  
- localStorage  
- window.print() for PDF export  

---

## 📂 Project Structure (Simple)

- index.html
- booking.html
- myBooking.html
- css/
- js/

---

## 🎯 Purpose of the Project
The project is made to practice:  
- DOM manipulation  
- Dynamic forms  
- Working with arrays and objects  
- Saving and loading data from localStorage  
- Basic printing/PDF techniques  
- Responsive UI with Tailwind
