// noinspection JSUnusedLocalSymbols

'use strict';

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin');
const withUtils = require('../_utils/withUtils');
const withWorkerUtils = require('../_utils/withWorkerUtils');

// bluetooth can only be supported in linux by turning on the switch "--enable-experimental-web-platform-features"
// However, when the experimental turns on, the properties of window, document, navigator will be polluted by new parameters
// so the version number of the browser does not correspond to it.
// We need to implement bluetooth class manually:
//

// We should strictly follow this definition and then insert the window to avoid detected by creepjs as being in wrong order
// Just like he detects the position of chrome in window :D

// "Bluetooth"
// "BluetoothCharacteristicProperties"
// "BluetoothDevice"
// "BluetoothRemoteGATTCharacteristic"
// "BluetoothRemoteGATTDescriptor"
// "BluetoothRemoteGATTServer"
// "BluetoothRemoteGATTService"
// "BluetoothUUID"

// https://github.com/WebBluetoothCG/web-bluetooth
// thanks to:
// https://github.com/thegecko/webbluetooth/blob/master/src/helpers.ts

class Plugin extends PuppeteerExtraPlugin {
    constructor(opts = {}) {
        super(opts);
    }

    get name() {
        return 'evasions/bluetooth';
    }

    async onPageCreated(page) {
        await withUtils(this, page).evaluateOnNewDocument(
            this.mainFunction,
        );
    }

    // onServiceWorkerContent(jsContent) {
    //     return withWorkerUtils(this, jsContent).evaluate(this.mainFunction);
    // }

    mainFunction = (utils) => {
        if ('undefined' !== typeof window.Bluetooth) {
            return;
        }

        const _Object = utils.cache.Object;
        const _Reflect = utils.cache.Reflect;

        /**
         * Known services enum
         */
        const bluetoothServices = {
            alert_notification: 0x1811,
            automation_io: 0x1815,
            battery_service: 0x180f,
            blood_pressure: 0x1810,
            body_composition: 0x181b,
            bond_management: 0x181e,
            continuous_glucose_monitoring: 0x181f,
            current_time: 0x1805,
            cycling_power: 0x1818,
            cycling_speed_and_cadence: 0x1816,
            device_information: 0x180a,
            environmental_sensing: 0x181a,
            generic_access: 0x1800,
            generic_attribute: 0x1801,
            glucose: 0x1808,
            health_thermometer: 0x1809,
            heart_rate: 0x180d,
            human_interface_device: 0x1812,
            immediate_alert: 0x1802,
            indoor_positioning: 0x1821,
            internet_protocol_support: 0x1820,
            link_loss: 0x1803,
            location_and_navigation: 0x1819,
            next_dst_change: 0x1807,
            phone_alert_status: 0x180e,
            pulse_oximeter: 0x1822,
            reference_time_update: 0x1806,
            running_speed_and_cadence: 0x1814,
            scan_parameters: 0x1813,
            tx_power: 0x1804,
            user_data: 0x181c,
            weight_scale: 0x181d,
        };

        /**
         * Known characteristics enum
         */
        const bluetoothCharacteristics = {
            aerobic_heart_rate_lower_limit: 0x2a7e,
            aerobic_heart_rate_upper_limit: 0x2a84,
            aerobic_threshold: 0x2a7f,
            age: 0x2a80,
            aggregate: 0x2a5a,
            alert_category_id: 0x2a43,
            alert_category_id_bit_mask: 0x2a42,
            alert_level: 0x2a06,
            alert_notification_control_point: 0x2a44,
            alert_status: 0x2a3f,
            altitude: 0x2ab3,
            anaerobic_heart_rate_lower_limit: 0x2a81,
            anaerobic_heart_rate_upper_limit: 0x2a82,
            anaerobic_threshold: 0x2a83,
            analog: 0x2a58,
            apparent_wind_direction: 0x2a73,
            apparent_wind_speed: 0x2a72,
            'gap.appearance': 0x2a01,
            barometric_pressure_trend: 0x2aa3,
            battery_level: 0x2a19,
            blood_pressure_feature: 0x2a49,
            blood_pressure_measurement: 0x2a35,
            body_composition_feature: 0x2a9b,
            body_composition_measurement: 0x2a9c,
            body_sensor_location: 0x2a38,
            bond_management_control_point: 0x2aa4,
            bond_management_feature: 0x2aa5,
            boot_keyboard_input_report: 0x2a22,
            boot_keyboard_output_report: 0x2a32,
            boot_mouse_input_report: 0x2a33,
            'gap.central_address_resolution_support': 0x2aa6,
            cgm_feature: 0x2aa8,
            cgm_measurement: 0x2aa7,
            cgm_session_run_time: 0x2aab,
            cgm_session_start_time: 0x2aaa,
            cgm_specific_ops_control_point: 0x2aac,
            cgm_status: 0x2aa9,
            csc_feature: 0x2a5c,
            csc_measurement: 0x2a5b,
            current_time: 0x2a2b,
            cycling_power_control_point: 0x2a66,
            cycling_power_feature: 0x2a65,
            cycling_power_measurement: 0x2a63,
            cycling_power_vector: 0x2a64,
            database_change_increment: 0x2a99,
            date_of_birth: 0x2a85,
            date_of_threshold_assessment: 0x2a86,
            date_time: 0x2a08,
            day_date_time: 0x2a0a,
            day_of_week: 0x2a09,
            descriptor_value_changed: 0x2a7d,
            'gap.device_name': 0x2a00,
            dew_point: 0x2a7b,
            digital: 0x2a56,
            dst_offset: 0x2a0d,
            elevation: 0x2a6c,
            email_address: 0x2a87,
            exact_time_256: 0x2a0c,
            fat_burn_heart_rate_lower_limit: 0x2a88,
            fat_burn_heart_rate_upper_limit: 0x2a89,
            firmware_revision_string: 0x2a26,
            first_name: 0x2a8a,
            five_zone_heart_rate_limits: 0x2a8b,
            floor_number: 0x2ab2,
            gender: 0x2a8c,
            glucose_feature: 0x2a51,
            glucose_measurement: 0x2a18,
            glucose_measurement_context: 0x2a34,
            gust_factor: 0x2a74,
            hardware_revision_string: 0x2a27,
            heart_rate_control_point: 0x2a39,
            heart_rate_max: 0x2a8d,
            heart_rate_measurement: 0x2a37,
            heat_index: 0x2a7a,
            height: 0x2a8e,
            hid_control_point: 0x2a4c,
            hid_information: 0x2a4a,
            hip_circumference: 0x2a8f,
            humidity: 0x2a6f,
            'ieee_11073-20601_regulatory_certification_data_list': 0x2a2a,
            indoor_positioning_configuration: 0x2aad,
            intermediate_blood_pressure: 0x2a36,
            intermediate_temperature: 0x2a1e,
            irradiance: 0x2a77,
            language: 0x2aa2,
            last_name: 0x2a90,
            latitude: 0x2aae,
            ln_control_point: 0x2a6b,
            ln_feature: 0x2a6a,
            'local_east_coordinate.xml': 0x2ab1,
            local_north_coordinate: 0x2ab0,
            local_time_information: 0x2a0f,
            location_and_speed: 0x2a67,
            location_name: 0x2ab5,
            longitude: 0x2aaf,
            magnetic_declination: 0x2a2c,
            magnetic_flux_density_2D: 0x2aa0,
            magnetic_flux_density_3D: 0x2aa1,
            manufacturer_name_string: 0x2a29,
            maximum_recommended_heart_rate: 0x2a91,
            measurement_interval: 0x2a21,
            model_number_string: 0x2a24,
            navigation: 0x2a68,
            new_alert: 0x2a46,
            'gap.peripheral_preferred_connection_parameters': 0x2a04,
            'gap.peripheral_privacy_flag': 0x2a02,
            plx_continuous_measurement: 0x2a5f,
            plx_features: 0x2a60,
            plx_spot_check_measurement: 0x2a5e,
            pnp_id: 0x2a50,
            pollen_concentration: 0x2a75,
            position_quality: 0x2a69,
            pressure: 0x2a6d,
            protocol_mode: 0x2a4e,
            rainfall: 0x2a78,
            'gap.reconnection_address': 0x2a03,
            record_access_control_point: 0x2a52,
            reference_time_information: 0x2a14,
            report: 0x2a4d,
            report_map: 0x2a4b,
            resting_heart_rate: 0x2a92,
            ringer_control_point: 0x2a40,
            ringer_setting: 0x2a41,
            rsc_feature: 0x2a54,
            rsc_measurement: 0x2a53,
            sc_control_point: 0x2a55,
            scan_interval_window: 0x2a4f,
            scan_refresh: 0x2a31,
            sensor_location: 0x2a5d,
            serial_number_string: 0x2a25,
            'gatt.service_changed': 0x2a05,
            software_revision_string: 0x2a28,
            sport_type_for_aerobic_and_anaerobic_thresholds: 0x2a93,
            supported_new_alert_category: 0x2a47,
            supported_unread_alert_category: 0x2a48,
            system_id: 0x2a23,
            temperature: 0x2a6e,
            temperature_measurement: 0x2a1c,
            temperature_type: 0x2a1d,
            three_zone_heart_rate_limits: 0x2a94,
            time_accuracy: 0x2a12,
            time_source: 0x2a13,
            time_update_control_point: 0x2a16,
            time_update_state: 0x2a17,
            time_with_dst: 0x2a11,
            time_zone: 0x2a0e,
            true_wind_direction: 0x2a71,
            true_wind_speed: 0x2a70,
            two_zone_heart_rate_limit: 0x2a95,
            tx_power_level: 0x2a07,
            uncertainty: 0x2ab4,
            unread_alert_status: 0x2a45,
            user_control_point: 0x2a9f,
            user_index: 0x2a9a,
            uv_index: 0x2a76,
            vo2_max: 0x2a96,
            waist_circumference: 0x2a97,
            weight: 0x2a98,
            weight_measurement: 0x2a9d,
            weight_scale_feature: 0x2a9e,
            wind_chill: 0x2a79,
        };

        /**
         * Known descriptors enum
         */
        const bluetoothDescriptors = {
            'gatt.characteristic_extended_properties': 0x2900,
            'gatt.characteristic_user_description': 0x2901,
            'gatt.client_characteristic_configuration': 0x2902,
            'gatt.server_characteristic_configuration': 0x2903,
            'gatt.characteristic_presentation_format': 0x2904,
            'gatt.characteristic_aggregate_format': 0x2905,
            valid_range: 0x2906,
            external_report_reference: 0x2907,
            report_reference: 0x2908,
            number_of_digitals: 0x2909,
            value_trigger_setting: 0x290a,
            es_configuration: 0x290b,
            es_measurement: 0x290c,
            es_trigger_setting: 0x290d,
            time_trigger_setting: 0x290e,
        };

        /**
         * Gets a canonical UUID from a partial UUID in string or hex format
         * @param uuid The partial UUID
         * @returns canonical UUID
         */
        function getCanonicalUUID(uuid) {
            if (typeof uuid === 'number') uuid = uuid.toString(16);
            uuid = uuid.toLowerCase();
            if (uuid.length <= 8)
                uuid =
                    ('00000000' + uuid).slice(-8) +
                    '-0000-1000-8000-00805f9b34fb';
            if (uuid.length === 32)
                uuid = uuid
                    .match(
                        /^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/,
                    )
                    .splice(1)
                    .join('-');
            return uuid;
        }

        /**
         * Gets a canonical service UUID from a known service name or partial UUID in string or hex format
         * @param service The known service name
         * @returns canonical UUID
         */
        function getServiceUUID(service) {
            // Check for string as enums also allow a reverse lookup which will match any numbers passed in
            if (
                typeof service === 'string' &&
                bluetoothServices[service]
            ) {
                service = bluetoothServices[service];
            }

            return getCanonicalUUID(service);
        }

        /**
         * Gets a canonical characteristic UUID from a known characteristic name or partial UUID in string or hex format
         * @param characteristic The known characteristic name
         * @returns canonical UUID
         */
        function getCharacteristicUUID(characteristic) {
            // Check for string as enums also allow a reverse lookup which will match any numbers passed in
            if (
                typeof characteristic === 'string' &&
                bluetoothCharacteristics[characteristic]
            ) {
                characteristic = bluetoothCharacteristics[characteristic];
            }

            return getCanonicalUUID(characteristic);
        }

        /**
         * Gets a canonical descriptor UUID from a known descriptor name or partial UUID in string or hex format
         * @param descriptor The known descriptor name
         * @returns canonical UUID
         */
        function getDescriptorUUID(descriptor) {
            // Check for string as enums also allow a reverse lookup which will match any numbers passed in
            if (
                typeof descriptor === 'string' &&
                bluetoothDescriptors[descriptor]
            ) {
                descriptor = bluetoothDescriptors[descriptor];
            }

            return getCanonicalUUID(descriptor);
        }

        // Define types

        // "Bluetooth"
        // "BluetoothCharacteristicProperties"
        // "BluetoothDevice"
        // "BluetoothRemoteGATTCharacteristic"
        // "BluetoothRemoteGATTDescriptor"
        // "BluetoothRemoteGATTServer"
        // "BluetoothRemoteGATTService"
        // "BluetoothUUID"

        let navigatorBluetoothHasSet = false;

        const BluetoothPseudo = function () {
            if (navigatorBluetoothHasSet) {
                throw utils.patchError(
                    new TypeError(`Illegal constructor`),
                    'construct',
                );
            }
        };

        const fakeBluetoothInstance = new BluetoothPseudo();

        utils.makePseudoClass(
            window,
            'Bluetooth',
            BluetoothPseudo,
            EventTarget,
        );
        utils.makePseudoClass(
            window,
            'BluetoothCharacteristicProperties',
            null,
            null,
        );
        utils.makePseudoClass(
            window,
            'BluetoothDevice',
            null,
            EventTarget,
        );
        utils.makePseudoClass(
            window,
            'BluetoothRemoteGATTCharacteristic',
            null,
            EventTarget,
        );
        utils.makePseudoClass(
            window,
            'BluetoothRemoteGATTDescriptor',
            null,
            null,
        );
        utils.makePseudoClass(
            window,
            'BluetoothRemoteGATTServer',
            null,
            null,
        );
        utils.makePseudoClass(
            window,
            'BluetoothRemoteGATTService',
            null,
            null,
        );
        utils.makePseudoClass(window, 'BluetoothUUID', null, null);

        // ==============================================================================================
        // BluetoothUUID
        // BluetoothUUID.canonicalUUID
        // BluetoothUUID.getCharacteristic
        // BluetoothUUID.getDescriptor
        // BluetoothUUID.getService
        // BluetoothUUID.prototype.[Symbol.toStringTag]

        utils.mockWithProxy(
            window.BluetoothUUID,
            'canonicalUUID',
            _Object.create,
            {
                configurable: true,
                enumerable: true,
                writable: true,
            },
            {
                get(target, property, receiver) {
                    if (property === 'name') {
                        return 'canonicalUUID';
                    }
                    if (property === 'length') {
                        return 1;
                    }

                    return _Reflect.get(target, property, receiver);
                },
                apply(target, thisArg, args) {
                    if (args.length === 0) {
                        throw utils.patchError(
                            new TypeError(
                                `Failed to execute 'canonicalUUID' on 'BluetoothUUID': 1 argument required, but only 0 present.`,
                            ),
                            'canonicalUUID',
                        );
                    }

                    if (!utils.isInt(args[0])) {
                        throw utils.patchError(
                            new TypeError(
                                `Failed to execute 'canonicalUUID' on 'BluetoothUUID': Value is not of type 'unsigned long'.`,
                            ),
                            'canonicalUUID',
                        );
                    }

                    return getCanonicalUUID(args[0]);
                },
            },
        );

        utils.mockWithProxy(
            window.BluetoothUUID,
            'getCharacteristic',
            _Object.create,
            {
                configurable: true,
                enumerable: true,
                writable: true,
            },
            {
                get(target, property, receiver) {
                    if (property === 'name') {
                        return 'getCharacteristic';
                    }
                    if (property === 'length') {
                        return 1;
                    }

                    return _Reflect.get(target, property, receiver);
                },
                apply(target, thisArg, args) {
                    if (args.length === 0) {
                        throw utils.patchError(
                            new TypeError(
                                `Failed to execute 'getCharacteristic' on 'BluetoothUUID': 1 argument required, but only 0 present.`,
                            ),
                            'getCharacteristic',
                        );
                    }

                    if ('number' === typeof args[0]) {
                        return getCanonicalUUID(args[0]);
                    }

                    if ('string' === typeof args[0]) {
                        // If it is a UUID string, construct a new string directly and return it.
                        if (utils.isUUID(args[0])) {
                            return '' + args[0];
                        }

                        // In the known Bluetooth Characteristic names：
                        const alias = bluetoothCharacteristics[args[0]];
                        if (alias) {
                            return getCanonicalUUID(alias);
                        }
                    }

                    throw utils.patchError(
                        new TypeError(
                            `Failed to execute 'getCharacteristic' on 'BluetoothUUID': Invalid Characteristic name: '${args[0]}'. It must be a valid UUID alias (e.g. 0x1234), UUID (lowercase hex characters e.g. '00001234-0000-1000-8000-00805f9b34fb'), or recognized standard name from https://www.bluetooth.com/specifications/gatt/characteristics e.g. 'aerobic_heart_rate_lower_limit'.`,
                        ),
                        'getCharacteristic',
                    );
                },
            },
        );

        utils.mockWithProxy(
            window.BluetoothUUID,
            'getDescriptor',
            _Object.create,
            {
                configurable: true,
                enumerable: true,
                writable: true,
            },
            {
                get(target, property, receiver) {
                    if (property === 'name') {
                        return 'getDescriptor';
                    }
                    if (property === 'length') {
                        return 1;
                    }

                    return _Reflect.get(target, property, receiver);
                },
                apply(target, thisArg, args) {
                    if (args.length === 0) {
                        throw utils.patchError(
                            new TypeError(
                                `Failed to execute 'getDescriptor' on 'BluetoothUUID': 1 argument required, but only 0 present.`,
                            ),
                            'getDescriptor',
                        );
                    }

                    if ('number' === typeof args[0]) {
                        return getCanonicalUUID(args[0]);
                    }

                    if ('string' === typeof args[0]) {
                        // If it is a UUID string, construct a new string directly and return it.
                        if (utils.isUUID(args[0])) {
                            return '' + args[0];
                        }

                        // In the known Bluetooth Descriptors names：
                        const alias = bluetoothDescriptors[args[0]];
                        if (alias) {
                            return getCanonicalUUID(alias);
                        }
                    }

                    throw utils.patchError(
                        new TypeError(
                            `Failed to execute 'getDescriptor' on 'BluetoothUUID': Invalid Descriptor name: '${args[0]}'. It must be a valid UUID alias (e.g. 0x1234), UUID (lowercase hex characters e.g. '00001234-0000-1000-8000-00805f9b34fb'), or recognized standard name from https://www.bluetooth.com/specifications/gatt/descriptors e.g. 'gatt.characteristic_presentation_format'.`,
                        ),
                        'getDescriptor',
                    );
                },
            },
        );

        utils.mockWithProxy(
            window.BluetoothUUID,
            'getService',
            _Object.create,
            {
                configurable: true,
                enumerable: true,
                writable: true,
            },
            {
                get(target, property, receiver) {
                    if (property === 'name') {
                        return 'getService';
                    }
                    if (property === 'length') {
                        return 1;
                    }

                    return _Reflect.get(target, property, receiver);
                },
                apply(target, thisArg, args) {
                    if (args.length === 0) {
                        throw utils.patchError(
                            new TypeError(
                                `Failed to execute 'getService' on 'BluetoothUUID': 1 argument required, but only 0 present.`,
                            ),
                            'getService',
                        );
                    }

                    if ('number' === typeof args[0]) {
                        return getCanonicalUUID(args[0]);
                    }

                    if ('string' === typeof args[0]) {
                        // If it is a UUID string, construct a new string directly and return it.
                        if (utils.isUUID(args[0])) {
                            return '' + args[0];
                        }

                        // In the known Bluetooth Services names：
                        const alias = bluetoothServices[args[0]];
                        if (alias) {
                            return getCanonicalUUID(alias);
                        }
                    }

                    throw utils.patchError(
                        new TypeError(
                            `Failed to execute 'getService' on 'BluetoothUUID': Invalid Service name: '${args[0]}'. It must be a valid UUID alias (e.g. 0x1234), UUID (lowercase hex characters e.g. '00001234-0000-1000-8000-00805f9b34fb'), or recognized standard name from https://www.bluetooth.com/specifications/gatt/services e.g. 'alert_notification'.`,
                        ),
                        'getService',
                    );
                },
            },
        );

        // ==============================================================================================
        // Bluetooth
        // Bluetooth.prototype.getAvailability
        // Bluetooth.prototype.requestDevice
        // Bluetooth.prototype.[Symbol.toStringTag]

        utils.mockWithProxy(
            window.Bluetooth.prototype,
            'getAvailability',
            _Object.create,
            {
                configurable: true,
                enumerable: true,
                writable: true,
            },
            {
                get(target, property, receiver) {
                    if (property === 'name') {
                        return 'getAvailability';
                    }
                    if (property === 'length') {
                        return 0;
                    }

                    return _Reflect.get(target, property, receiver);
                },
                apply(target, thisArg, args) {
                    if (thisArg === window.Bluetooth.prototype) {
                        // Want to call it directly from window.Bluetooth.prototype.getAvailability()? No way!
                        return Promise.reject(
                            utils.patchError(
                                new TypeError(
                                    `Failed to execute 'getAvailability' on 'Bluetooth': Illegal invocation`,
                                ),
                                'getAvailability',
                            ),
                        );
                    }

                    return Promise.resolve(true);
                },
            },
        );

        utils.mockWithProxy(
            window.Bluetooth.prototype,
            'requestDevice',
            _Object.create,
            {
                configurable: true,
                enumerable: true,
                writable: true,
            },
            {
                get(target, property, receiver) {
                    if (property === 'name') {
                        return 'requestDevice';
                    }
                    if (property === 'length') {
                        return 0;
                    }

                    return _Reflect.get(target, property, receiver);
                },
                apply(target, thisArg, args) {
                    return new utils.cache.Promise((resolve, reject) => {
                        if (thisArg === window.Bluetooth.prototype) {
                            // Want to call it directly from window.Bluetooth.prototype.requestDevice()? No way!
                            return reject(
                                utils.patchError(
                                    new TypeError(
                                        `Failed to execute 'requestDevice' on 'Bluetooth': Illegal invocation`,
                                    ),
                                    'requestDevice',
                                ),
                            );
                        }

                        // https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice
                        // * filters[]: An array of BluetoothScanFilters. This filter consists of an array of BluetoothServiceUUIDs, a name parameter, and a namePrefix parameter.
                        // * optionalServices[]: An array of BluetoothServiceUUIDs.
                        // * acceptAllDevices: A boolean value indicating that the requesting script can accept all Bluetooth devices. The default is false.
                        if (args.length === 0) {
                            return reject(
                                utils.patchError(
                                    new TypeError(
                                        `Failed to execute 'requestDevice' on 'Bluetooth': Either 'filters' should be present or 'acceptAllDevices' should be true, but not both.`,
                                    ),
                                    'requestDevice',
                                ),
                            );
                        }

                        const {
                            filters,
                            optionalServices,
                            acceptAllDevices,
                        } = args[0];

                        if ('undefined' !== typeof filters) {
                            // After experimenting, the basic data type throws this exception.
                            if (
                                filters === null ||
                                'number' === typeof filters ||
                                'boolean' === typeof filters ||
                                'string' === typeof filters ||
                                'symbol' === typeof filters ||
                                'bigint' === typeof filters
                            ) {
                                return reject(
                                    utils.patchError(
                                        new TypeError(
                                            `Failed to execute 'requestDevice' on 'Bluetooth': Failed to read the 'filters' property from 'RequestDeviceOptions': The provided value cannot be converted to a sequence.`,
                                        ),
                                        'requestDevice',
                                    ),
                                );
                            }

                            if (
                                'function' !==
                                typeof filters[Symbol.iterator]
                            ) {
                                return reject(
                                    utils.patchError(
                                        new TypeError(
                                            `Failed to execute 'requestDevice' on 'Bluetooth': Failed to read the 'filters' property from 'RequestDeviceOptions': The object must have a callable @@iterator property.`,
                                        ),
                                        'requestDevice',
                                    ),
                                );
                            }

                            if (!utils.isSequence(filters)) {
                                return reject(
                                    utils.patchError(
                                        new TypeError(
                                            `Failed to execute 'requestDevice' on 'Bluetooth': Failed to read the 'filters' property from 'RequestDeviceOptions': The provided value cannot be converted to a sequence.`,
                                        ),
                                        'requestDevice',
                                    ),
                                );
                            }
                        }

                        if (
                            // filters and acceptAllDevices cannot have values at the same time.
                            ('undefined' === typeof filters &&
                                !acceptAllDevices) ||
                            // !! Here we can't check filters.length.
                            // According to experiments, filters is considered by chrome to have a value if it is an empty array.
                            ('undefined' !==
                                typeof filters /* && filters.length */ &&
                                acceptAllDevices)
                        ) {
                            return reject(
                                utils.patchError(
                                    new TypeError(
                                        `Failed to execute 'requestDevice' on 'Bluetooth': Either 'filters' should be present or 'acceptAllDevices' should be true, but not both.`,
                                    ),
                                    'requestDevice',
                                ),
                            );
                        }

                        if (!filters.length) {
                            return reject(
                                utils.patchError(
                                    new TypeError(
                                        `Failed to execute 'requestDevice' on 'Bluetooth': 'filters' member must be non-empty to find any devices.`,
                                    ),
                                    'requestDevice',
                                ),
                            );
                        }

                        for (const filter of filters) {
                            // The filter type can only be: services, name, namePrefix
                            const filterNames = _Object.keys(filter);
                            if (
                                !utils.intersectionSet(filterNames, [
                                    'services',
                                    'name',
                                    'namePrefix',
                                ]).size
                            ) {
                                return reject(
                                    utils.patchError(
                                        new TypeError(
                                            `Failed to execute 'requestDevice' on 'Bluetooth': A filter must restrict the devices in some way.`,
                                        ),
                                        'requestDevice',
                                    ),
                                );
                            }

                            for (const key in filter) {
                                const value = filter[key];

                                if (
                                    key === 'services' &&
                                    'undefined' !== typeof value
                                ) {
                                    const serviceValues = value;

                                    if (
                                        serviceValues === null ||
                                        'number' ===
                                            typeof serviceValues ||
                                        'boolean' ===
                                            typeof serviceValues ||
                                        'string' ===
                                            typeof serviceValues ||
                                        'symbol' ===
                                            typeof serviceValues ||
                                        'bigint' === typeof serviceValues
                                    ) {
                                        return reject(
                                            utils.patchError(
                                                new TypeError(
                                                    `Failed to execute 'requestDevice' on 'Bluetooth': Failed to read the 'filters' property from 'RequestDeviceOptions': Failed to read the 'services' property from 'BluetoothLEScanFilterInit': The provided value cannot be converted to a sequence.`,
                                                ),
                                                'requestDevice',
                                            ),
                                        );
                                    }

                                    if (
                                        'function' !==
                                        typeof serviceValues[
                                            Symbol.iterator
                                        ]
                                    ) {
                                        return reject(
                                            utils.patchError(
                                                new TypeError(
                                                    `Failed to execute 'requestDevice' on 'Bluetooth': Failed to read the 'filters' property from 'RequestDeviceOptions': Failed to read the 'services' property from 'BluetoothLEScanFilterInit': The object must have a callable @@iterator property.`,
                                                ),
                                                'requestDevice',
                                            ),
                                        );
                                    }

                                    if (!utils.isSequence(serviceValues)) {
                                        return reject(
                                            utils.patchError(
                                                new TypeError(
                                                    `Failed to execute 'requestDevice' on 'Bluetooth': Failed to read the 'filters' property from 'RequestDeviceOptions': Failed to read the 'services' property from 'BluetoothLEScanFilterInit': The provided value cannot be converted to a sequence.`,
                                                ),
                                                'requestDevice',
                                            ),
                                        );
                                    }

                                    if (!serviceValues.length) {
                                        return reject(
                                            utils.patchError(
                                                new TypeError(
                                                    `Failed to execute 'requestDevice' on 'Bluetooth': 'services', if present, must contain at least one service.`,
                                                ),
                                                'requestDevice',
                                            ),
                                        );
                                    }

                                    // Check if each item of serviceValues is legal
                                    for (const serviceValue of serviceValues) {
                                        if (
                                            'symbol' ===
                                            typeof serviceValue
                                        ) {
                                            return reject(
                                                utils.patchError(
                                                    new TypeError(
                                                        `Cannot convert a Symbol value to a string`,
                                                    ),
                                                    'requestDevice',
                                                ),
                                            );
                                        }

                                        if (
                                            'number' ===
                                            typeof serviceValue
                                        ) {
                                            continue;
                                        }

                                        if (
                                            'string' ===
                                            typeof serviceValue
                                        ) {
                                            // If it is a UUID string, construct a new string directly and return it.
                                            if (
                                                utils.isUUID(serviceValue)
                                            ) {
                                                continue;
                                            }

                                            // In the known Bluetooth Services names：
                                            const alias =
                                                bluetoothServices[
                                                    serviceValue
                                                ];
                                            if (alias) {
                                                continue;
                                            }
                                        }

                                        let invalidServiceName;
                                        if (serviceValue === null) {
                                            invalidServiceName = 'null';
                                        } else if (
                                            serviceValue === undefined
                                        ) {
                                            invalidServiceName =
                                                'undefined';
                                        } else {
                                            invalidServiceName =
                                                serviceValue.toString();
                                        }

                                        return reject(
                                            utils.patchError(
                                                new TypeError(
                                                    `Failed to execute 'requestDevice' on 'Bluetooth': Invalid Service name: '${invalidServiceName}'. It must be a valid UUID alias (e.g. 0x1234), UUID (lowercase hex characters e.g. '00001234-0000-1000-8000-00805f9b34fb'), or recognized standard name from https://www.bluetooth.com/specifications/gatt/services e.g. 'alert_notification'.`,
                                                ),
                                                'requestDevice',
                                            ),
                                        );
                                    }
                                }
                            }
                        }

                        // All checks are done and we need to wait a few seconds to simulate user rejection.
                        const sleepMs = utils.random(1500, 5000);
                        utils.sleep(sleepMs).then(() => {
                            reject(
                                utils.patchError(
                                    new DOMException(
                                        `User cancelled the requestDevice() chooser.`,
                                    ),
                                    'requestDevice',
                                ),
                            );
                        });
                    });
                },
            },
        );

        // We have to implement the three methods inherited from EventTarget :(

        const eventTarget = new EventTarget();

        // noinspection JSUndefinedPropertyAssignment
        fakeBluetoothInstance.addEventListener =
            eventTarget.addEventListener.bind(eventTarget);
        // noinspection JSUndefinedPropertyAssignment
        fakeBluetoothInstance.dispatchEvent =
            eventTarget.dispatchEvent.bind(eventTarget);
        // noinspection JSUndefinedPropertyAssignment
        fakeBluetoothInstance.removeEventListener =
            eventTarget.removeEventListener.bind(eventTarget);

        const eventTargetFuncNames = [
            'addEventListener',
            'dispatchEvent',
            'removeEventListener',
        ];

        utils.mockGetterWithProxy(
            Navigator.prototype,
            'bluetooth',
            _Object.create,
            {
                configurable: true,
                enumerable: true,
            },
            {
                apply(target, thisArg, args) {
                    return new Proxy(fakeBluetoothInstance, {
                        getOwnPropertyDescriptor: (
                            target,
                            propertyKey,
                        ) => {
                            if (
                                eventTargetFuncNames.includes(propertyKey)
                            ) {
                                return undefined;
                            }

                            return _Reflect.getOwnPropertyDescriptor(
                                target,
                                propertyKey,
                            );
                        },
                        ownKeys: (target) => {
                            let result = _Reflect.ownKeys(target);
                            result = Array.from(
                                utils.differenceABSet(
                                    result,
                                    eventTargetFuncNames,
                                ),
                            );

                            return result;
                        },
                    });
                },
            },
        );

        navigatorBluetoothHasSet = true;

        // ==============================================================================================
        // BluetoothDevice
        // BluetoothDevice.prototype.get gatt
        // BluetoothDevice.prototype.get id
        // BluetoothDevice.prototype.get name
        // BluetoothDevice.prototype.get ongattserverdisconnected
        // BluetoothDevice.prototype.set ongattserverdisconnected
        // BluetoothDevice.prototype.[Symbol.toStringTag]

        // Several other classes are similar and we handle them in a unified way.
        // Covenant:
        // get default length is 0
        // set default length is 1
        // value default length is 0

        /*

        // dump props:

        const classes = [
            'BluetoothDevice',
            'BluetoothRemoteGATTCharacteristic',
            'BluetoothRemoteGATTDescriptor',
            'BluetoothRemoteGATTServer',
            'BluetoothRemoteGATTService',
        ];

        const map = [];

        for (const cls of classes) {
            const def = {
                name: cls,
                props: [],
            };

            map.push(def);

            const props = Object.getOwnPropertyDescriptors(window[cls].prototype);
            for (const prop in props) {
                if (prop === 'constructor') {
                    continue;
                }

                const desc = props[prop];
                const propDef = {
                    name: prop,
                    descriptor: {
                        configurable: desc.configurable,
                        writable: desc.writable,
                        enumerable: desc.enumerable,
                    },
                    visit: {},
                };

                if (desc.get) {
                    propDef.visit.get = {length: desc.get.length, name: desc.get.name};
                }

                if (desc.set) {
                    propDef.visit.set = {length: desc.set.length, name: desc.set.name};
                }

                if (desc.value) {
                    propDef.visit.value = {length: desc.value.length, name: desc.value.name};
                }

                def.props.push(propDef);
            }
        }

        console.log(JSON.stringify(map, null, 4));

        */

        const map = [
            {
                name: 'BluetoothDevice',
                props: [
                    {
                        name: 'id',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get id',
                            },
                        },
                    },
                    {
                        name: 'name',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get name',
                            },
                        },
                    },
                    {
                        name: 'gatt',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get gatt',
                            },
                        },
                    },
                    {
                        name: 'ongattserverdisconnected',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get ongattserverdisconnected',
                            },
                            set: {
                                length: 1,
                                name: 'set ongattserverdisconnected',
                            },
                        },
                    },
                ],
            },
            {
                name: 'BluetoothRemoteGATTCharacteristic',
                props: [
                    {
                        name: 'service',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get service',
                            },
                        },
                    },
                    {
                        name: 'uuid',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get uuid',
                            },
                        },
                    },
                    {
                        name: 'properties',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get properties',
                            },
                        },
                    },
                    {
                        name: 'value',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get value',
                            },
                        },
                    },
                    {
                        name: 'oncharacteristicvaluechanged',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get oncharacteristicvaluechanged',
                            },
                            set: {
                                length: 1,
                                name: 'set oncharacteristicvaluechanged',
                            },
                        },
                    },
                    {
                        name: 'getDescriptor',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 1,
                                name: 'getDescriptor',
                            },
                        },
                    },
                    {
                        name: 'getDescriptors',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'getDescriptors',
                            },
                        },
                    },
                    {
                        name: 'readValue',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'readValue',
                            },
                        },
                    },
                    {
                        name: 'startNotifications',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'startNotifications',
                            },
                        },
                    },
                    {
                        name: 'stopNotifications',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'stopNotifications',
                            },
                        },
                    },
                    {
                        name: 'writeValue',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 1,
                                name: 'writeValue',
                            },
                        },
                    },
                    {
                        name: 'writeValueWithResponse',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 1,
                                name: 'writeValueWithResponse',
                            },
                        },
                    },
                    {
                        name: 'writeValueWithoutResponse',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 1,
                                name: 'writeValueWithoutResponse',
                            },
                        },
                    },
                ],
            },
            {
                name: 'BluetoothRemoteGATTDescriptor',
                props: [
                    {
                        name: 'characteristic',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get characteristic',
                            },
                        },
                    },
                    {
                        name: 'uuid',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get uuid',
                            },
                        },
                    },
                    {
                        name: 'value',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get value',
                            },
                        },
                    },
                    {
                        name: 'readValue',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'readValue',
                            },
                        },
                    },
                    {
                        name: 'writeValue',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 1,
                                name: 'writeValue',
                            },
                        },
                    },
                ],
            },
            {
                name: 'BluetoothRemoteGATTServer',
                props: [
                    {
                        name: 'device',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get device',
                            },
                        },
                    },
                    {
                        name: 'connected',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get connected',
                            },
                        },
                    },
                    {
                        name: 'connect',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'connect',
                            },
                        },
                    },
                    {
                        name: 'disconnect',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'disconnect',
                            },
                        },
                    },
                    {
                        name: 'getPrimaryService',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 1,
                                name: 'getPrimaryService',
                            },
                        },
                    },
                    {
                        name: 'getPrimaryServices',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'getPrimaryServices',
                            },
                        },
                    },
                ],
            },
            {
                name: 'BluetoothRemoteGATTService',
                props: [
                    {
                        name: 'device',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get device',
                            },
                        },
                    },
                    {
                        name: 'uuid',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get uuid',
                            },
                        },
                    },
                    {
                        name: 'isPrimary',
                        descriptor: {
                            configurable: true,
                            enumerable: true,
                        },
                        visit: {
                            get: {
                                length: 0,
                                name: 'get isPrimary',
                            },
                        },
                    },
                    {
                        name: 'getCharacteristic',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 1,
                                name: 'getCharacteristic',
                            },
                        },
                    },
                    {
                        name: 'getCharacteristics',
                        descriptor: {
                            configurable: true,
                            writable: true,
                            enumerable: true,
                        },
                        visit: {
                            value: {
                                length: 0,
                                name: 'getCharacteristics',
                            },
                        },
                    },
                ],
            },
        ];

        for (const { name, props } of map) {
            for (const { name: propName, descriptor, visit } of props) {
                if (visit.get) {
                    utils.mockGetterWithProxy(
                        window[name].prototype,
                        propName,
                        _Object.create,
                        descriptor,
                        {
                            get: (target, property, receiver) => {
                                if (property === 'name') {
                                    return visit.get.name;
                                }

                                if (property === 'length') {
                                    return visit.get.length;
                                }

                                return _Reflect.get(
                                    target,
                                    property,
                                    receiver,
                                );
                            },
                            apply: (target, thisArg, args) => {
                                throw utils.patchError(
                                    new TypeError(`Illegal invocation`),
                                    propName,
                                );
                            },
                        },
                    );
                }

                if (visit.value) {
                    utils.mockWithProxy(
                        window[name].prototype,
                        propName,
                        _Object.create,
                        descriptor,
                        {
                            get: (target, property, receiver) => {
                                if (property === 'name') {
                                    return visit.value.name;
                                }

                                if (property === 'length') {
                                    return visit.value.length;
                                }

                                return _Reflect.get(
                                    target,
                                    property,
                                    receiver,
                                );
                            },
                            apply: (target, thisArg, args) => {
                                throw utils.patchError(
                                    new TypeError(`Illegal invocation`),
                                    propName,
                                );
                            },
                        },
                    );
                }

                if (visit.set) {
                    utils.mockSetterWithProxy(
                        window[name].prototype,
                        propName,
                        _Object.create,
                        descriptor,
                        {
                            get: (target, property, receiver) => {
                                if (property === 'name') {
                                    return visit.set.name;
                                }

                                if (property === 'length') {
                                    return visit.set.length;
                                }

                                return _Reflect.get(
                                    target,
                                    property,
                                    receiver,
                                );
                            },
                            apply: (target, thisArg, args) => {
                                throw utils.patchError(
                                    new TypeError(`Illegal invocation`),
                                    propName,
                                );
                            },
                        },
                    );
                }
            }
        }

        // end for

        // ===========================================
    };
}

module.exports = function (pluginConfig) {
    return new Plugin(pluginConfig);
};
