# -*- coding: utf-8 -*-

# test skip-traceback extension

import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from IPython import get_ipython
from notebook.services.config import ConfigManager

driver = None
ip = get_ipython()
assert ip is not None


def enable_nbextension(name):
    global ip
    cm = ConfigManager(parent=ip.parent, config=ip.config)
    cm.update('notebook', {"load_extensions": {name: True}})


def disable_nbextension(name):
    global ip
    cm = ConfigManager(parent=ip.parent, config=ip.config)
    cm.update('notebook', {"load_extensions": {name: None}})


def setup_func():
    global driver
    driver = webdriver.Chrome()  # Optional argument, if not specified will search path.
    time.sleep(2)


def test_skip_traceback():
    enable_nbextension('usability/skip-traceback/main')
    driver.get('http://127.0.0.1:8888/notebooks/Untitled.ipynb')
    time.sleep(1)

    driver.execute_script('IPython.notebook.select(0)')
    cell = driver.find_element_by_class_name('code_cell')
    cell.send_keys('\na'+Keys.SHIFT+Keys.RETURN)
    time.sleep(1)
    assert 'Traceback (most recent call last)' not in driver.page_source

    button = driver.find_element_by_id('toggle_traceback')
    button.click()
    driver.execute_script('IPython.notebook.select(0)')
    cell = driver.find_element_by_class_name('code_cell')
    cell.send_keys('\na'+Keys.SHIFT+Keys.RETURN)
    time.sleep(1)
    assert 'Traceback (most recent call last)' in driver.page_source
    disable_nbextension('usability/skip-traceback/main')


def teardown_func():
    global driver
    driver.close()

if __name__ == '__main__':
    setup_func()
    test_skip_traceback()
    teardown_func()

