/**
 * Analytics Utility (Cloudflare Web Analytics Compatible)
 * 
 * Cloudflare Web Analytics automatically tracks page views without any code.
 * This file is kept for potential future custom event tracking or can be removed.
 * 
 * Note: Cloudflare Analytics is cookie-free and privacy-first by default.
 * No user consent required, no third-party cookies, fully GDPR compliant.
 */

/**
 * Log event to console for debugging
 * Since Cloudflare Analytics handles page views automatically,
 * we just log custom events for debugging purposes
 */
const logEvent = (eventName, eventData = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Event: ${eventName}`, eventData)
  }
}

/**
 * Track CV download event
 * Tracks when users click the "Download CV" button
 */
export const trackCVDownload = () => {
  logEvent('CV Download', { action: 'download', type: 'cv' })
}

/**
 * Track successful contact form submission
 * @param {Object} formData - The submitted form data
 * @param {string} formData.subject - Message subject
 */
export const trackContactFormSubmission = (formData = {}) => {
  logEvent('Contact Form Submit', { 
    action: 'submit',
    subject: formData.subject || 'Unknown'
  })
}

/**
 * Track project demo/link clicks
 * @param {string} projectName - Name of the project
 * @param {string} linkType - Type of link ('demo', 'github', 'source')
 * @param {string} url - The URL being visited
 */
export const trackProjectView = (projectName, linkType = 'demo', url = '') => {
  logEvent('Project View', { 
    project: projectName,
    linkType,
    url
  })
}

/**
 * Track social media link clicks
 * @param {string} platform - Social media platform ('github', 'linkedin', 'email')
 * @param {string} location - Where the link was clicked from
 */
export const trackSocialClick = (platform, location = 'unknown') => {
  logEvent('Social Click', { 
    platform,
    location
  })
}

/**
 * Track custom events
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Additional event parameters
 */
export const trackCustomEvent = (eventName, eventParams = {}) => {
  logEvent(eventName, eventParams)
}
