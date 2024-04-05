/* globals cordova, require, exports, module */

/**
 *  Diagnostic Camera plugin for Android
 *
 *  Copyright (c) 2015 Working Edge Ltd.
 *  Copyright (c) 2012 AVANTIC ESTUDIO DE INGENIEROS
 **/
var Diagnostic_Camera = (function(){
    /***********************
     *
     * Internal properties
     *
     *********************/
    var Diagnostic_Camera = {};

    var Diagnostic = require("cordova.plugins.diagnostic.Diagnostic");

    /********************
     *
     * Public properties
     *
     ********************/

    /********************
     *
     * Internal functions
     *
     ********************/

    function mapFromLegacyCameraApi() {
        var params = arguments[0] || {}; // Initialize with an empty object if not provided
        // Check if the first argument is a function (success callback)
        if (typeof params.successCallback === "function") {
            // Check if there's an error callback function
            if (typeof params.errorCallback === "function") {
                params.errorCallback = arguments[1];
            }
            // Check if the third argument is false (storage)
            if (arguments.length > 2 && arguments[2] === false) {
                params.storage = arguments[2];
            }
        }
        // Set default value for 'storage' if not explicitly defined
        if (params.storage === undefined) {
            params.storage = true; // Default to true
        }
        return params;
    }


    function numberOfKeys(obj){
        var count = 0;
        for(var k in obj){
            count++;
        }
        return count;
    }


    /*****************************
     *
     * Protected member functions
     *
     ****************************/

    /**********************
     *
     * Public API functions
     *
     **********************/

    /**
     * Checks if camera is usable: both present and authorised for use.
     *
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback -  The callback which will be called when the operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if camera is present and authorized for use.
     *  - {Function} errorCallback -  The callback which will be called when the operation encounters an error.
     *  This callback function is passed a single string parameter containing the error message.
     * - {Boolean} storage - (Android only) If true, requests storage permissions in addition to CAMERA run-time permission.
     *  On Android 13+, storage permissions are READ_MEDIA_IMAGES and READ_MEDIA_VIDEO. On Android 9-12, storage permission is READ_EXTERNAL_STORAGE.
     *  cordova-plugin-camera requires both storage and camera permissions.
     *  Defaults to true.
     */
    Diagnostic_Camera.isCameraAvailable = function(params) {
        params = mapFromLegacyCameraApi.apply(this, arguments);

        params.successCallback = params.successCallback || function(){};
        Diagnostic_Camera.isCameraPresent(function(isPresent){
            if(isPresent){
                Diagnostic_Camera.isCameraAuthorized(params);
            }else{
                params.successCallback(!!isPresent);
            }
        },params.errorCallback);
    };

    /**
     * Checks if camera hardware is present on device.
     *
     * @param {Function} successCallback -  The callback which will be called when the operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if camera is present
     * @param {Function} errorCallback -  The callback which will be called when the operation encounters an error.
     *  This callback function is passed a single string parameter containing the error message.
     */
    Diagnostic_Camera.isCameraPresent = function(successCallback, errorCallback) {
        return cordova.exec(Diagnostic._ensureBoolean(successCallback),
            errorCallback,
            'Diagnostic_Camera',
            'isCameraPresent',
            []);
    };

    /**
     * Requests authorisation for runtime permissions to use the camera.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will have no effect as the permissions are already granted at installation time.
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - function to call on successful request for runtime permissions.
     * This callback function is passed a single string parameter which defines the resulting authorisation status as a value in cordova.plugins.diagnostic.permissionStatus.
     *  - {Function} errorCallback - function to call on failure to request authorisation.
     * - {Boolean} storage - (Android only) If true, requests storage permissions in addition to CAMERA run-time permission.
     *  On Android 13+, storage permissions are READ_MEDIA_IMAGES and READ_MEDIA_VIDEO. On Android 9-12, storage permission is READ_EXTERNAL_STORAGE.
     *  cordova-plugin-camera requires both storage and camera permissions.
     *  Defaults to true.
     */
    Diagnostic_Camera.requestCameraAuthorization = function(params){
        params = mapFromLegacyCameraApi.apply(this, arguments);

        params.successCallback = params.successCallback || function(){};
        var onSuccess = function(statuses){
            params.successCallback(numberOfKeys(statuses) > 1 ? cordova.plugins.diagnostic._combinePermissionStatuses(statuses): statuses[Diagnostic.permission.CAMERA]);
        };

        return cordova.exec(onSuccess,
            params.errorCallback,
            'Diagnostic_Camera',
            'requestCameraAuthorization',
            [!!params.storage]);
    };

    /**
     * Returns the authorisation status for runtime permissions to use the camera.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will always return GRANTED status as permissions are already granted at installation time.
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - function to call on successful request for runtime permission status.
     * This callback function is passed a single string parameter which defines the current authorisation status as a value in cordova.plugins.diagnostic.permissionStatus.
     *  - {Function} errorCallback - function to call on failure to request authorisation status.
     * - {Boolean} storage - (Android only) If true, requests storage permissions in addition to CAMERA run-time permission.
     *  On Android 13+, storage permissions are READ_MEDIA_IMAGES and READ_MEDIA_VIDEO. On Android 9-12, storage permission is READ_EXTERNAL_STORAGE.
     *  cordova-plugin-camera requires both storage and camera permissions.
     *  Defaults to true.
     */
    Diagnostic_Camera.getCameraAuthorizationStatus = function(params){
        params = mapFromLegacyCameraApi.apply(this, arguments);

        params.successCallback = params.successCallback || function(){};
        var onSuccess = function(statuses){
            params.successCallback(numberOfKeys(statuses) > 1 ? cordova.plugins.diagnostic._combinePermissionStatuses(statuses): statuses[Diagnostic.permission.CAMERA]);
        };

        return cordova.exec(onSuccess,
            params.errorCallback,
            'Diagnostic_Camera',
            'getCameraAuthorizationStatus',
            [!!params.storage]);
    };

    /**
     * Checks if the application is authorized to use the camera.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will always return TRUE as permissions are already granted at installation time.
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - function to call on successful request for runtime permissions status.
     * This callback function is passed a single boolean parameter which is TRUE if the app currently has runtime authorisation to use location.
     *  - {Function} errorCallback - function to call on failure to request authorisation status.
     * - {Boolean} storage - (Android only) If true, requests storage permissions in addition to CAMERA run-time permission.
     *  On Android 13+, storage permissions are READ_MEDIA_IMAGES and READ_MEDIA_VIDEO. On Android 9-12, storage permission is READ_EXTERNAL_STORAGE.
     *  cordova-plugin-camera requires both storage and camera permissions.
     *  Defaults to true.
     */
    Diagnostic_Camera.isCameraAuthorized = function(params){
        params = mapFromLegacyCameraApi.apply(this, arguments);

        params.successCallback = params.successCallback || function(){};
        var onSuccess = function(status){
            params.successCallback(status === Diagnostic.permissionStatus.GRANTED);
        };

        Diagnostic_Camera.getCameraAuthorizationStatus({
            successCallback: onSuccess,
            errorCallback: params.errorCallback,
            storage: params.storage
        });
    };

    return Diagnostic_Camera;
});
module.exports = new Diagnostic_Camera();
