/**
 * Google Analytics Event Tracking Utility
 * 
 * This module provides helper functions to track important user actions
 * in Google Analytics using the gtag.js library.
 */

/**
 * Check if gtag is available (Google Analytics loaded)
 * @returns {boolean} Whether gtag is available
 */
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/**
 * Track CV download event
 * Tracks when users click the "Download CV" button
 */
export const trackCVDownload = () => {
  if (!isGtagAvailable()) {
    console.warn('Google Analytics (gtag) is not available')
    return
  }
  
  window.gtag('event', 'cv_download', {
    event_category: 'engagement',
    event_label: 'CV Download Button',
    value: 1
  })
  
  console.log('GA Event: CV Download tracked')
}

/**
 * Track successful contact form submission
 * @param {Object} formData - The submitted form data
 * @param {string} formData.name - User's name
 * @param {string} formData.email - User's email
 * @param {string} formData.subject - Message subject
 */
export const trackContactFormSubmission = (formData = {}) => {
  if (!isGtagAvailable()) {
    console.warn('Google Analytics (gtag) is not available')
    return
  }
  
  window.gtag('event', 'contact_form_submit', {
    event_category: 'engagement',
    event_label: 'Contact Form Submission',
    subject: formData.subject || 'Unknown',
    value: 5 // Higher value for direct contact
  })
  
  console.log('GA Event: Contact Form Submission tracked')
}

/**
 * Track project demo/link clicks
 * @param {string} projectName - Name of the project (e.g., 'Vaultique', 'Cybertopia')
 * @param {string} linkType - Type of link ('demo', 'github', 'source')
 * @param {string} url - The URL being visited
 */
export const trackProjectView = (projectName, linkType = 'demo', url = '') => {
  if (!isGtagAvailable()) {
    console.warn('Google Analytics (gtag) is not available')
    return
  }
  
  window.gtag('event', 'project_view', {
    event_category: 'project_engagement',
    event_label: `${projectName} - ${linkType}`,
    project_name: projectName,
    link_type: linkType,
    destination_url: url,
    value: 3
  })
  
  console.log(`GA Event: Project View tracked - ${projectName} (${linkType})`)
}

/**
 * Track social media link clicks
 * @param {string} platform - Social media platform ('github', 'linkedin', 'email')
 * @param {string} location - Where the link was clicked from ('hero', 'contact', 'footer')
 */
export const trackSocialClick = (platform, location = 'unknown') => {
  if (!isGtagAvailable()) {
    console.warn('Google Analytics (gtag) is not available')
    return
  }
  
  window.gtag('event', 'social_click', {
    event_category: 'social_engagement',
    event_label: `${platform} - ${location}`,
    platform: platform,
    click_location: location,
    value: 2
  })
  
  console.log(`GA Event: Social Click tracked - ${platform} from ${location}`)
}

/**
 * Track custom events
 * Generic function for tracking any custom event
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Additional event parameters
 */
export const trackCustomEvent = (eventName, eventParams = {}) => {
  if (!isGtagAvailable()) {
    console.warn('Google Analytics (gtag) is not available')
    return
  }
  
  window.gtag('event', eventName, eventParams)
  
  console.log(`GA Event: Custom event tracked - ${eventName}`, eventParams)
}
