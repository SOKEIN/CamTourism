-- ==============================================================================
-- CamTourism Official Database Schema (MySQL / Laragon / Docker Compatible)
-- Character Set: utf8mb4 (Full Khmer Unicode & Emoji Support)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `camtourism` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `camtourism`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `inquiries`;
DROP TABLE IF EXISTS `destinations`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `provinces`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. Provinces Table (All 25 Provinces & Capital)
-- ------------------------------------------------------------------------------
CREATE TABLE `provinces` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_kh` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `region_kh` VARCHAR(100) NOT NULL,
  `region_en` VARCHAR(100) NOT NULL,
  `count_destinations` INT DEFAULT 0,
  `image` VARCHAR(500) NOT NULL,
  `desc_kh` TEXT NOT NULL,
  `desc_en` TEXT NOT NULL,
  `top_spots_kh` JSON NULL,
  `top_spots_en` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_region (`region_en`),
  INDEX idx_slug (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Travel Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name_kh` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(20) NOT NULL,
  `count_spots` INT DEFAULT 0,
  `desc_kh` TEXT NULL,
  `desc_en` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Destinations Table (Curated Real Cambodian Attractions)
-- ------------------------------------------------------------------------------
CREATE TABLE `destinations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_kh` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `province_id` INT NOT NULL,
  `category_slug` VARCHAR(50) NOT NULL,
  `cat_kh` VARCHAR(100) NOT NULL,
  `cat_en` VARCHAR(100) NOT NULL,
  `rating` DECIMAL(2,1) DEFAULT 4.8,
  `reviews_count` INT DEFAULT 0,
  `image` VARCHAR(500) NOT NULL,
  `hero_image` VARCHAR(500) NOT NULL,
  `desc_kh` TEXT NOT NULL,
  `desc_en` TEXT NOT NULL,
  `location_kh` VARCHAR(255) NOT NULL,
  `location_en` VARCHAR(255) NOT NULL,
  `hours` VARCHAR(100) DEFAULT '07:00 – 17:30',
  `ticket` VARCHAR(255) DEFAULT 'Free / Included',
  `best_time_kh` VARCHAR(255) NULL,
  `best_time_en` VARCHAR(255) NULL,
  `time_spent` VARCHAR(100) NULL,
  `distance` VARCHAR(100) NULL,
  `facilities` JSON NULL,
  `nearby_ids` JSON NULL,
  `is_popular` BOOLEAN DEFAULT FALSE,
  `popular_badge_kh` VARCHAR(100) NULL,
  `popular_badge_en` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dest_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE CASCADE,
  INDEX idx_dest_province (`province_id`),
  INDEX idx_dest_category (`category_slug`),
  INDEX idx_dest_rating (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Inquiries & Tour Booking Requests
-- ------------------------------------------------------------------------------
CREATE TABLE `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `province_interest` VARCHAR(100) NULL,
  `destination_id` INT NULL,
  `travelers_count` INT DEFAULT 1,
  `travel_date` DATE NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'contacted', 'confirmed', 'cancelled') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. User Reviews Table
-- ------------------------------------------------------------------------------
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `destination_id` INT NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `user_avatar` VARCHAR(500) NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_review_destination` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. User Favorites / Bookmarks
-- ------------------------------------------------------------------------------
CREATE TABLE `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_or_user_id` VARCHAR(100) NOT NULL,
  `destination_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_dest` (`session_or_user_id`, `destination_id`),
  CONSTRAINT `fk_favorite_destination` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
