# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import io
import json
import os

import nose.tools as nt
from ipython_genutils.tempdir import TemporaryDirectory
from notebook.utils import url_path_join


from nbextensions_test_base import SeleniumNbextensionTestBase


# from http://nose.readthedocs.io/en/latest/writing_tests.html#writing-tests
#
# > nose runs functional tests in the order in which they appear in the module
# > file. TestCase-derived tests and other test classes are run in alphabetical
# > order
#
# So, I name test methods of classes using numbers to control execution order.


class ConfiguratorTest(SeleniumNbextensionTestBase):
    """Tests for the nbextensions_configurator server extension."""

    @classmethod
    def setup_class(cls):
        """Add in a broken yaml file in an extra nbextensions dir."""
        cls.broken_nbext_parent_dir = TemporaryDirectory()
        broken_nbext_path = os.path.join(
            cls.broken_nbext_parent_dir.name, 'broken_nbextensions')
        os.mkdir(broken_nbext_path)
        broken_yaml_path = os.path.join(broken_nbext_path, 'broken_nbext.yaml')
        with io.open(broken_yaml_path, 'w') as f:
            f.write('not valid yaml!: [')

        cls.config.NotebookApp.get('extra_nbextensions_path', []).append(
            broken_nbext_path)

        super(ConfiguratorTest, cls).setup_class()

        cls.nbext_configurator_url = url_path_join(
            cls.base_url(), 'nbextensions')

    def test_00_load_nbextensions_page(self):
        """Check that <base_url>/nbextensions url loads correctly."""
        self.driver.get(self.nbext_configurator_url)

    def test_01_page_title(self):
        nt.assert_in('extension', self.driver.title.lower())
        nt.assert_in('configuration', self.driver.title.lower())

    def test_02_body_data_attribute(self):
        elem = self.driver.find_element_by_tag_name('body')
        attr = elem.get_attribute('data-extension-list')
        nt.assert_is_not_none(
            attr, 'body tag should have a "data-extension-list" attribute')
        nbext_list = json.loads(attr)
        nt.assert_greater(
            len(nbext_list), 0, 'some nbextensions should be found')

    def test_03_extension_ui_presence(self):
        self.wait_for_selector('.nbext-row', 'an extension ui should load')
        enable_links = self.driver.find_elements_by_css_selector(
            '.nbext-selector')
        nt.assert_greater(
            len(enable_links), 0, 'some nbextensions should have enable links')

    def test_04_readme_rendering(self):
        # load the collapsible headings UI, as it has a readme to render
        collapsible_link = self.driver.find_element_by_partial_link_text(
            'Collapsible Headings')
        collapsible_link.click()

        # # uncomment below to scroll readme into view
        # # (may require a time.sleep as well)
        # driver.execute_script(
        #     "document.querySelector('.nbext-readme').scrollIntoView()")
        self.wait_for_selector('.nbext-readme-contents img',
                               'there should be an image in the readme')

    def test_05_click_page_readme_link(self):
        self.driver.find_element_by_css_selector('.nbext-page-title a').click()
        self.wait_for_selector('.rendermd-page-title')
